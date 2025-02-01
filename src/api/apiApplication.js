import supabaseClient, { supabaseUrl } from "@/utils/supabase";
//fetch questions

export async function getQuestions(token, _, job_id) {
  console.log("geting QuestionsForJob", job_id);
  console.log("token", token);
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("question")
    .select("*")
    .eq("job_id", job_id);
  console.log("questions having Job id we r going to passed ", data);
  if (error) {
    console.error("Error fetching Questions:", error);
    return null;
  }

  return data;
}

// fetch requirements
export async function getRequirements(token, job_id) {
  console.log("geting RequirementsForJob", job_id);
  console.log("token", token);
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select("requirments")
    .eq("id", job_id);

  if (error) {
    console.error("Error fetching Requirements:", error);
    return null;
  }

  console.log("requirements in getRequirements", data[0].requirments);
  return data;
}

// - Apply to job ( candidate )
export async function applyToJob(token, _, jobData) {
  const requirements = await getRequirements(token, jobData.job_id);
  console.log("requirements in aplyjob ", requirements[0]);
  console.log(" jobdata  ", jobData);
  console.log("score in apply job ", jobData.score);
  console.log("total score in apply ", jobData.totalscore);

  const supabase = await supabaseClient(token);

  const formData = new FormData();
  formData.append("pdf", jobData.resume);
  formData.append("requirements", JSON.stringify(requirements[0]));

  const response = await fetch("http://127.0.0.1:5000/extract-text", {
    method: "POST",
    body: formData,
  });
  // console.log(response);
  if (!response.ok) {
    throw new Error("Error extracting text from resume");
  }

  const extractedData = await response.json();
  console.log("Extracted Data score only :", extractedData.score);
  console.log("Extracted Feedback :", extractedData.feedback);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) throw new Error("Error uploading Resume");

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
        cvScore: extractedData.score, // Add CV score
        feedback: extractedData.feedback, // Add feedback
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Application");
  }

  return data;
}

// - Edit Application Status ( recruiter )
export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}
