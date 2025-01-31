import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { City } from "country-state-city";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirments: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirments: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch((token, options, questions, jobData) => {
    return addNewJob(token, questions, jobData);
  });

  const onSubmit = async (data) => {
    const jobData = {
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    };

    console.log("Job Content:", jobData);
    console.log("Questions in Postjob:", questions);

    try {
      const response = await fnCreateJob(questions, jobData);

      if (response.success) {
        console.log("Job Created with ID:", response.jobId);
        navigate("/jobs");
      } else {
        // Handle the error case properly
        console.error("Failed to create job:", response.error);
        // Maybe show an error message to the user
        // setError(response.error); // if you have error state
      }
    } catch (error) {
      console.error("Error creating job or saving questions:", error);
    }
  };

  useEffect(() => {
    if (dataCreateJob) {
      console.log("Job data:", dataCreateJob);
      navigate("/jobs");
    }
  }, [dataCreateJob]);

  useEffect(() => {
    if (errorCreateJob) {
      console.error("Error occurred:", errorCreateJob);
      // Handle error (show message, etc.)
    }
  }, [errorCreateJob]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(null);

  const addQuestion = () => {
    if (
      !newQuestion.trim() ||
      correctOption === null ||
      newOptions.some((opt) => !opt.trim())
    ) {
      alert(
        "Please fill out the question, options, and select a correct option."
      );
      return;
    }

    const newQuestionObj = {
      id: questions.length + 1,
      question: newQuestion,
      options: newOptions,
      correctOption,
    };

    setQuestions([...questions, newQuestionObj]);
    setNewQuestion("");
    setNewOptions(["", "", "", ""]);
    setCorrectOption(null);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }




  const openPdfInNewTab = () => {
    const pdfUrl = 'https://zivmzxapgocoikohtyvo.supabase.co/storage/v1/object/public/pdf_file//Goku.pdf'; // Replace with your actual public URL
    window.open(pdfUrl, '_blank');
  };

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {City.getCitiesOfCountry("PK").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                        ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Controller
          name="requirments"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirments && (
          <p className="text-red-500">{errors.requirments.message}</p>
        )}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob.message}</p>
        )}
        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}

        <div className="mt-4 p-6 max-w-full bg-gray-900 text-white">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Manage MCQ Questions</h1>

            {/* <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
              <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Pink to orange
              </span>
            </button> */}


            <button type="button"
              onClick={openPdfInNewTab}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Open PDF
              </span>
            </button>

          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="font-semibold text-lg mb-2">
                  {question.question}
                </h2>
                <ul className="list-disc list-inside space-y-1">
                  {question.options.map((option, index) => (
                    <li
                      key={index}
                      className={`${question.correctOption === index
                        ? "text-green-400 font-bold"
                        : ""
                        }`}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-500 mt-4 hover:underline"
                >
                  Remove Question
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Add a New MCQ Question</h2>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter your MCQ question"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 mb-4 placeholder-gray-400"
            ></textarea>

            {newOptions.map((option, index) => (
              <div key={index} className="mb-3 flex items-center gap-4">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...newOptions];
                    updatedOptions[index] = e.target.value;
                    setNewOptions(updatedOptions);
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 placeholder-gray-400"
                />
                <input
                  type="radio"
                  checked={correctOption === index}
                  onChange={() => setCorrectOption(index)}
                  className="form-radio text-blue-500"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-600 px-6 py-2 rounded-lg text-white hover:bg-blue-700"
            >
              Add Question
            </button>
          </div>
        </div>

        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
