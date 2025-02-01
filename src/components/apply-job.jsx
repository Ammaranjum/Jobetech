/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  cgpa: z
    .number()
    .min(0, { message: "CGPA must be at least 0" })
    .max(4, { message: "CGPA must be at most 4" }),
  city: z.string().min(1, { message: "City is required" }),
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine((file) => file[0] && file[0].type === "application/pdf", {
      message: "Only PDF documents are allowed",
    }),
});

export function ApplyJobDrawer({
  user,
  job,
  fetchJob,
  applied = false,
  questions,
}) {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState(""); // Added for file name tracking

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const calculateScores = () => {
    let score = 0;
    let totalscore = questions ? questions.length : 0;

    questions?.forEach((question) => {
      const selectedOption = answers[question.id];
      const selectedIndex = [
        "option1",
        "option2",
        "option3",
        "option4",
      ].indexOf(selectedOption);

      if (selectedIndex === question.ans) {
        score++;
      }
    });

    return { score, totalscore };
  };

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    const { score, totalscore } = calculateScores();

    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      status: "Applied",
      resume: data.resume[0],
      score,
      totalscore,
    }).then(() => {
      fetchJob();
      reset();
      setAnswers({});
      setFileName(""); // Reset file name after submission
    });
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Set file name when a file is selected
    } else {
      setFileName(""); // Reset file name if no file is selected
    }
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied || isSubmitting}
        >
          {job?.isOpen
            ? applied
              ? "Applied"
              : isSubmitting
              ? "Submitting..."
              : "Apply"
            : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        disableOverlayClick
        disableSwipe
        style={{
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>
            Please Fill Form and Dont Forget to Solve the MCQS Based Test
          </DrawerDescription>
        </DrawerHeader>

        {/* Scrollable Form */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 1rem" }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Name */}
            <Input
              type="text"
              placeholder="Full Name"
              className="flex-1"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}

            {/* Email */}
            <Input
              type="email"
              placeholder="Email"
              className="flex-1"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            {/* Phone */}
            <Input
              type="text"
              placeholder="Phone Number"
              className="flex-1"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
            )}

            {/* CGPA */}
            <Input
              type="number"
              placeholder="CGPA"
              className="flex-1"
              {...register("cgpa", { valueAsNumber: true })}
            />
            {errors.cgpa && (
              <p className="text-red-500">{errors.cgpa.message}</p>
            )}

            {/* City */}
            <Input
              type="text"
              placeholder="City"
              className="flex-1"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-red-500">{errors.city.message}</p>
            )}

            {/* Years of Experience */}
            <Input
              type="number"
              placeholder=" Relevant Experience in Years "
              className="flex-1"
              {...register("experience", { valueAsNumber: true })}
            />
            {errors.experience && (
              <p className="text-red-500">{errors.experience.message}</p>
            )}

            {/* Skills */}
            <Input
              type="text"
              placeholder="Tools and Technologies you are confident (Comma Seprated only) "
              className="flex-1"
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-red-500">{errors.skills.message}</p>
            )}

            {/* Education */}
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} {...field}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Graduate" id="graduate" />
                    <Label htmlFor="graduate">Graduate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Post Graduate" id="post-graduate" />
                    <Label htmlFor="post-graduate">Post Graduate</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.education && (
              <p className="text-red-500">{errors.education.message}</p>
            )}

            {/* CV Upload */}
            <div className="mt-4">
              <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-[#60a5fa] rounded-lg bg-[#1f2937] hover:bg-[#374151] transition-all cursor-pointer">
                {fileName ? (
                  <span className="text-gray-200 text-base font-semibold mb-2">
                    {fileName}
                  </span>
                ) : (
                  <>
                    <span className="text-gray-200 text-base font-semibold mb-2">
                      Upload Your CV
                    </span>
                    <span className="text-gray-400 text-sm">
                      (Supports .pdf only)
                    </span>
                  </>
                )}
                <Input
                  type="file"
                  accept=".pdf, .doc, .docx"
                  className="hidden"
                  {...register("resume", { onChange: handleFileChange })}
                />
              </label>
              {errors.resume && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.resume.message}
                </p>
              )}
            </div>

            {/* Questions */}
            <h2 className="text-xl font-semibold text-gray-100 mt-6">
              Answers these Questions
            </h2>
            <div className="mt-4 space-y-4">
              {questions?.map((question) => (
                <div
                  key={question.id}
                  className="bg-[#374151] p-4 rounded-lg shadow-md border border-[#4b5563]"
                >
                  <p className="text-base font-semibold text-gray-100 mb-2">
                    {question.questionString}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      question.option1,
                      question.option2,
                      question.option3,
                      question.option4,
                    ].map((option, index) => (
                      <label
                        key={index}
                        htmlFor={`${question.id}-option${index + 1}`}
                        className="flex items-center space-x-2 p-2 rounded-md border border-[#4b5563] hover:border-[#60a5fa] bg-[#1f2937] cursor-pointer transition-all"
                      >
                        <input
                          type="radio"
                          id={`${question.id}-option${index + 1}`}
                          name={`question-${question.id}`}
                          value={option}
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                          className="form-radio h-4 w-4 text-[#60a5fa]"
                        />
                        <span className="text-sm text-gray-200">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Error and Loading */}
            {errorApply?.message && (
              <p className="text-red-500">{errorApply?.message}</p>
            )}
            {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}
          </form>
        </div>

        {/* Footer */}
        <DrawerFooter
          style={{ padding: "1rem", borderTop: "1px solid #e5e7eb" }}
        >
          <Button
            type="submit"
            variant="blue"
            size="lg"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? "Submitting..." : "Apply"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
