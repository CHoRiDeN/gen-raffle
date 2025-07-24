# v0.1.0
# { "Depends": "py-genlayer:latest" }

from genlayer import *
from dataclasses import dataclass
import json
import uuid
import re

def parse_llm_json_response(result: str, expected_key: str) -> str:
    """
    Parse JSON response from LLM with robust error handling and fallback extraction.
    
    Args:
        result: Raw response from LLM
        expected_key: The key to extract from the JSON response
    
    Returns:
        The value associated with the expected_key
    
    Raises:
        Exception: If JSON parsing and regex extraction both fail
    """
    print("Response from LLM: ", result)
    # Clean and parse the JSON result more robustly
    cleaned_result = result.strip()
    # Remove markdown code blocks if present
    if cleaned_result.startswith("```json"):
        cleaned_result = cleaned_result[7:]
    if cleaned_result.startswith("```"):
        cleaned_result = cleaned_result[3:]
    if cleaned_result.endswith("```"):
        cleaned_result = cleaned_result[:-3]
    cleaned_result = cleaned_result.strip()
    
    try:
        json_result = json.loads(cleaned_result)
        value = json_result[expected_key]
        print(f'LLM calculated {expected_key}: {value}')
        return value
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw result: {result}")
        print(f"Cleaned result: {cleaned_result}")
        # Fallback: try to extract just the value using regex
        pattern = rf'"{expected_key}"\s*:\s*"([^"]+)"'
        match = re.search(pattern, cleaned_result)
        if match:
            value = match.group(1)
            print(f'Extracted {expected_key} from regex: {value}')
            return value
        else:
            raise Exception(f"Could not parse JSON response for key '{expected_key}': {result}")

@allow_storage
@dataclass
class RaffleAnswer:
    answer: str
    address: str
    score: str

# contract class
class RaffleContract(gl.Contract):
    raffle_status: str
    evaluation_criteria: str #respuesta a "como se elige la mejor respuesta"
    constraints: str #respuesta a "cuales son las restricciones"
    title: str #titulo del concurso
    description: str #descripcion del concurso
    answers: TreeMap[str,RaffleAnswer]
    winner: str

    # constructor
    def __init__(self, evaluation_criteria: str, constraints: str, title: str, description: str):
        self.evaluation_criteria = evaluation_criteria
        self.constraints = constraints
        self.title = title
        self.description = description
        self.raffle_status = "OPEN"

    # read methods must be annotated with view
    @gl.public.view
    def get_state(self) -> dict:
        return {
            "evaluation_criteria": self.evaluation_criteria,
            "constraints": self.constraints,
            "title": self.title,
            "description": self.description,
            "answers": {k: v for k, v in self.answers.items()},
            "winner": self.winner,
            "raffle_status": self.raffle_status
        }
        

    @gl.public.write
    def resolve_contract(
        self
    ) -> None:
        evaluation_criteria = self.evaluation_criteria
        if self.raffle_status == "CLOSED":
            raise Exception("Raffle is already closed")

        
        #need to parse all answers and for each:
        ## order by score
        sorted_answers = sorted(self.answers.values(), key=lambda x: float(x.score), reverse=True)

        # Get the first 4 answers
        top_4_answers = sorted_answers[:4]
        answers_json = [{"answer": answer.answer, "address": answer.address} for answer in top_4_answers]
        str_answers = json.dumps(answers_json)


        task = f"""
SYSTEM:
You are the Raffle Judge. You will receive the following inputs:
  • “criteria”: the dimension to score by (e.g. “funniest”, “most interesting”, “most curious”).  
  • “story_topic”: the prompt or call participants responded to (e.g. “Tell me your funniest pizza‑eating story.”).  
  • “answers”: a list of participant submissions, each containing an “answer” and an “address”.

Respond in JSON:
{{
    "best_address": str
}}
It is mandatory that you respond only using the JSON format above,
nothing else. Don't include any other words or characters,
your output must be only JSON without any formatting prefix or suffix.
This result should be perfectly parsable by a JSON parser without errors.

Your task:
1. Relevance check:
   - For each “answer”, if it does **not** address the “story_topic” (it’s off‑topic, empty, or nonsensical), immediately assign a score of **1**.
2. Scoring:
   - Otherwise, evaluate each “answer” **only** on the given “criteria”:
     • **1** = fails completely  
     • **5** = adequately meets expectations  
     • **10** = outstanding, exceeds all expectations  
3. Selection:
   - Determine the “answer” with the highest score. In case of a tie, select the first one in the list.
4. Output:
   - Return the “address” of the best “answer”.

USER:
criteria = {evaluation_criteria}  
answers = {str_answers}

JUDGE:


        """

        def leader_fn():
            result = gl.nondet.exec_prompt(task)
            winner = parse_llm_json_response(result, "best_address")
            return winner

        def validator_fn(
            leader_score: gl.vm.Result,
        ) -> bool:
            validator_winner = leader_fn()
            if not isinstance(leader_score, gl.vm.Return):
                return False
            # Extract the actual score value from the Return object
            leader_winner = leader_score.calldata
            print('validator_winner',validator_winner)
            print('leader_winner',leader_winner)
            return (
                validator_winner == validator_winner
            )

        result = gl.vm.run_nondet(leader_fn, validator_fn)

        print("winner:", result)

        self.raffle_status = "CLOSED"
        self.winner = result
       

       
        


    @gl.public.write
    def add_entry(
        self, answer: str
    ) -> None:
        if self.raffle_status == "CLOSED":
            raise Exception("Raffle is already closed")

        address = gl.message.sender_address.as_hex
        evaluation_criteria = self.evaluation_criteria
        title = self.title
        description = self.description
        constraints = self.constraints

        
            
        task = f"""
You are an evaluator. Your task is to rate an answer for a contest given a title, description, criteria and constraints.

Rules:
1. If the answer is not following the constraints, return 0.
2. Otherwise, score from 0 to 100 based on how well the answer matches the criteria:
   - 0 = does not meet the criteria at all (or unrelated).
   - 100 = perfectly matches the criteria.
   - Use intermediate values for partial matches.
3. Output only a single number (integer or one decimal). Do not add any explanation or text.

Input:
- Title: {title}
- Description: {description}
- Criteria: {evaluation_criteria}
- Constraints: {constraints}
- Answer: {answer}

Output:
A single number between 0 and 100 (for example: `85`).

Respond in JSON:
{{
    "score": str
}}



        """
        def leader_fn():
            result = gl.nondet.exec_prompt(task)
            score = parse_llm_json_response(result, "score")
            return score

        def validator_fn(
            leader_score: gl.vm.Result,
        ) -> bool:
            validator_score = leader_fn()
            if not isinstance(leader_score, gl.vm.Return):
                return False
            # Extract the actual score value from the Return object
            leader_score_value = leader_score.calldata
            print('validator_score',float(validator_score))
            print('leader_score_value',float(leader_score_value))
            return (
                abs(float(validator_score) - float(leader_score_value))
                <= 10
            )

        result = gl.vm.run_nondet(leader_fn, validator_fn)

        print('result score general',result)

        self.answers[address] = RaffleAnswer(answer=answer, address=address, score=str(result))