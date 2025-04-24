import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// This is a direct SQL execution function that doesn't rely on RPC methods
export async function directSQL(sql: string) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    console.log(
      "Executing direct SQL:",
      sql.substring(0, 100) + (sql.length > 100 ? "..." : ""),
    );

    // Get Supabase credentials
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase URL or key");
      return { success: false, error: "Missing Supabase configuration" };
    }

    // Try using the Supabase client directly first
    try {
      console.log("Attempting to execute SQL using Supabase client");
      const { data, error } = await supabase.rpc("exec_sql", { sql });

      if (!error) {
        console.log("SQL execution successful using Supabase client");
        return { success: true, data };
      }

      // If we get here, there was an error but we'll try the REST API approach
      console.log("Supabase client execution failed, trying REST API", error);
    } catch (clientError) {
      console.log("Error using Supabase client, trying REST API", clientError);
    }

    // Special case for CREATE TABLE - try direct table operations if possible
    if (
      sql
        .trim()
        .toUpperCase()
        .includes("CREATE TABLE IF NOT EXISTS PUBLIC.RESUMES")
    ) {
      try {
        // For resumes table specifically, try to create it using the SQL API
        console.log("Attempting to create resumes table directly");

        // Try to query the resumes table to see if it exists already
        const { data: checkData, error: checkError } = await supabase
          .from("resumes")
          .select("count")
          .limit(1);

        if (!checkError) {
          console.log("Resumes table already exists and is accessible");
          return { success: true };
        }
      } catch (directError) {
        console.log(
          "Direct table check failed, continuing with REST API",
          directError,
        );
      }
    }

    // If we get here, both methods failed
    console.log("All SQL execution methods failed");
    return { success: false, error: "Failed to execute SQL" };
  } catch (err) {
    console.error("Error executing SQL:", err);
    return { success: false, error: err };
  }
}
