/* eslint-disable react/prop-types */
import useFetch from "@/hooks/use-fetch";
import { updateApplicationStatus } from "../api/apiApplication";
import { BriefcaseBusiness, School, Boxes, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  return (
    <Card className="w-full">
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader className="p-4">
        <CardTitle className="flex justify-between items-center font-bold text-lg">
          <span>{application?.name}</span>
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleDownload}
          />
          <span className="text-sm text-gray-500">
            Applied on: {new Date(application?.created_at).toLocaleDateString()}
          </span>
          {isCandidate ? (
            <span className="capitalize font-bold text-sm">
              Status: {application.status}
            </span>
          ) : (
            <Select
              onValueChange={handleStatusChange}
              defaultValue={application.status}
              disabled={loadingHiringStatus}
            >
              <SelectTrigger className="w-40">
                {loadingHiringStatus ? (
                  <span>Updating...</span>
                ) : (
                  <SelectValue placeholder="Application Status" />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Compact Grid Layout for Applicant Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {/* Column 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Email:</span>
              <span className="text-gray-600">{application?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Phone:</span>
              <span className="text-gray-600">{application?.phone}</span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">City:</span>
              <span className="text-gray-600">{application?.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">CV Score:</span>
              <span className="text-gray-600">{application?.cvScore}</span>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness size={15} className="text-gray-500" />
              <span>{application?.experience} years of experience</span>
            </div>
            <div className="flex items-center gap-2">
              <School size={15} className="text-gray-500" />
              <span>{application?.education}</span>
            </div>
            <div className="flex items-center gap-2">
              <Boxes size={15} className="text-gray-500" />
              <span>Skills: {application?.skills}</span>
            </div>
          </div>

          {/* Merged Row */}
          <div className="col-span-2 space-y-2">
            <div className="flex items-center">
              <span className="font-semibold">Recommender Feedback:</span>
              <span className="text-gray-600">
                {application?.feedback || "No feedback provided"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
