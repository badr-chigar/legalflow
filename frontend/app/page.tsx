import { redirect } from "next/navigation";

// La garde de session (middleware.ts) tranche entre /login et /dashboard ;
// ceci n'est qu'un filet de sécurité.
export default function IndexPage() {
  redirect("/dashboard");
}
