import supabaseClient from "@/utils/supabase";

// Fetch Jobs
// Fetch Jobs
export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Read Saved Jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

// Read single job
export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select(
      "*, company: companies(name,logo_url), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

// - Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the job is already saved, remove it
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return data;
    }

    return data;
  } else {
    // If the job is not saved, add it to saved jobs
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      return data;
    }

    return data;
  }
}

// - job isOpen toggle - (recruiter_id = auth.uid())
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

// get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;

}

//add a job

export async function addNewJob(token, questions, jobData) {
  const supabase = await supabaseClient(token);
 console.log("jobData",jobData)
 console.log("questions",questions)
  try {
    // Insert the job and retrieve the job ID
    const { data: jobDataResponse, error: jobError } = await supabase
      .from("jobs")
      .insert([jobData])
      .select();

    if (jobError) {
      console.error("Error inserting job:", jobError);
      return { success: false, error: "Failed to create job." };
    }

    const jobId = jobDataResponse[0]?.id;

    console.log("Job Created with ID:", jobId);

    if (!jobId) {
      return { success: false, error: "Failed to retrieve job ID after insertion." };
    }

    // Check if questions are valid
    if (!questions || questions.length === 0) {
      return { success: false, error: "No questions provided to save." };
    }

    // Map questions to DB format
    const questionEntries = questions.map((question) => ({
      questionString: question.question || "No question provided",
      option1: question.options[0] ,
      option2: question.options[1],
      option3: question.options[2] ,
      option4: question.options[3] ,
      ans: question.correctOption,
      job_id: jobId,
    }));

    console.log("Mapped question entries before DB insertion:", questionEntries);

    // Insert questions into the database
    const { data: questionsData, error: questionsError } = await supabase
      .from("question")
      .insert(questionEntries)
      .select();

    if (questionsError) {
      console.error("Error inserting questions:", questionsError);
      return { success: false, error: "Failed to save questions." };
    }

    console.log("Questions added successfully:", questionsData);

    return jobDataResponse;
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Unexpected error occurred." };
  }
}
