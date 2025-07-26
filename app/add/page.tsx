import CreateContractForm from "@/components/CreateContractForm";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function AddPage() {
    return (
        <>
            <SignedIn>
                <CreateContractForm />
            </SignedIn>
            <SignedOut>
                <div className="max-w-2xl mx-auto p-6">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h1 className="text-xl font-bold text-gray-900 mb-6">You need to be logged in to create a raffle</h1>
                        <SignInButton />
                        <SignUpButton>
                            <Button size="sm">
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </div>
                </div>
            </SignedOut>
        </>
    )
}