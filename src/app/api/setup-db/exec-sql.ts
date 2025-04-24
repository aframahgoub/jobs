import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function executeSQL(sql: string) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    console.log(
      "Executing SQL:",
      sql.substring(0, 100) + (sql.length > 100 ? "..." : ""),
    );

    // Try using the RPC method first
    try {
      const { data, error } = await supabase.rpc("exec_sql", { sql });

      if (!error) {
        console.log("SQL execution successful via RPC");
        return { success: true, data };
      }

      console.log("RPC method failed, trying direct query approach", error);
    } catch (rpcError) {
      console.log(
        "RPC method not available, trying direct query approach",
        rpcError,
      );
    }

    // Try direct query as a fallback
    try {
      // For simple CREATE TABLE statements, try to execute directly
      if (
        sql.trim().toUpperCase().startsWith("CREATE TABLE") ||
        sql.trim().toUpperCase().startsWith("CREATE EXTENSION")
      ) {
        try {
          // Try executing the SQL directly
          const { data, error } = await supabase.rpc("exec_sql", { sql });

          if (!error) {
            console.log("Direct SQL execution successful");
            return { success: true, data };
          }

          // For CREATE TABLE specifically, check if we can query the table
          if (
            sql
              .trim()
              .toUpperCase()
              .includes("CREATE TABLE IF NOT EXISTS PUBLIC.RESUMES")
          ) {
            try {
              const { data: checkData, error: checkError } = await supabase
                .from("resumes")
                .select("count")
                .limit(1);

              if (!checkError) {
                console.log("Table exists and is accessible");
                return { success: true };
              }
            } catch (innerQueryError) {
              console.log("Failed to query resumes table:", innerQueryError);
            }
          }
        } catch (directQueryError) {
          console.log(
            "Direct table creation attempt failed, continuing with other methods",
            directQueryError,
          );
        }
      }
    } catch (directError) {
      console.log("Direct query failed", directError);
    }

    // If we get here, both methods failed
    console.log("All SQL execution methods failed");
    return { success: false, error: "Failed to execute SQL" };
  } catch (err) {
    console.error("Error executing SQL:", err);
    return { success: false, error: err };
  }
}
