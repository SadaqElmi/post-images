import Link from "next/link";

export default function VerifiedPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 className="font-sans font-bold text-center text-4xl">
        Email verified successfully!
      </h1>
      <p>
        You can now{" "}
        <Link href="/" className="text-blue-500 underline	">
          go back to the homepage
        </Link>
        .
      </p>
    </div>
  );
}
