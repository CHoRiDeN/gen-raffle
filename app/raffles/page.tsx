import { getRaffles } from "@/actions/databaseActions";
import RaffleTest from "@/components/RaffleTest";

export default async function RafflesPage() {
    const raffles = await getRaffles();
    console.log("RAFFLES: ", raffles);
    return <RaffleTest/>
}