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
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" }
    ),
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
      const selectedOption = answers[question.id]; // e.g., "option1", "option2", etc.
      const selectedIndex = [
        "option1",
        "option2",
        "option3",
        "option4",
      ].indexOf(selectedOption); // Map to index (0, 1, 2, 3)

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
      name: user.fullName,
      status: "Applied",
      resume: data.resume[0],
      score,
      totalscore,
    }).then(() => {
      fetchJob();
      reset();
      setAnswers({});
    });
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
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
        disableswipe
        style={{
          maxHeight: "90vh", // Ensure the drawer doesn't exceed the viewport height
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Prevent double scrollbars
        }}
      >
        {/* Header */}
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please Fill the form below</DrawerDescription>
        </DrawerHeader>

        {/* Scrollable Form */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 1rem" }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input
              type="number"
              placeholder="Years of Experience"
              className="flex-1"
              {...register("experience", {
                valueAsNumber: true,
              })}
            />
            {errors.experience && (
              <p className="text-red-500">{errors.experience.message}</p>
            )}
            <Input
              type="text"
              placeholder="Skills (Comma Separated)"
              className="flex-1"
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-red-500">{errors.skills.message}</p>
            )}
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
            <Input
              type="file"
              accept=".pdf, .doc, .docx"
              className="flex-1 file:text-gray-500"
              {...register("resume")}
            />
            {errors.resume && (
              <p className="text-red-500">{errors.resume.message}</p>
            )}

            <div className="mt-4">
              {questions?.map((question) => (
                <div key={question.id} className="mb-4">
                  <p>{question.questionString}</p>
                  <div className="flex space-x-4">
                    {[
                      question.option1,
                      question.option2,
                      question.option3,
                      question.option4,
                    ].map((option, index) => (
                      <div key={index}>
                        <input
                          type="radio"
                          id={`${question.id}-option${index + 1}`}
                          name={`question-${question.id}`}
                          value={option}
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                        />
                        <Label htmlFor={`${question.id}-option${index + 1}`}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {errorApply?.message && (
              <p className="text-red-500">{errorApply?.message}</p>
            )}
            {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}
          </form>
        </div>

        {/* Fixed Footer */}
        <DrawerFooter
          style={{ padding: "1rem", borderTop: "1px solid #e5e7eb" }}
        >
          <Button
            type="submit"
            variant="blue"
            size="lg"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)} // Ensure the form is submitted
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
