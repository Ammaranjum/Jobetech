import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { updateApplicationStatus } from "../api/apiApplication";

const ApplicationFilters = ({ applications, onFilteredResults }) => {
  const initialFilters = {
    searchText: "",
    city: "",
    minCvScore: "",
    maxCvScore: "",
    education: "",
    minExperience: "",
    status: "",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Get unique cities from applications for the dropdown
  const cities = [...new Set(applications.map((app) => app.city))];
  const educationLevels = [
    ...new Set(applications.map((app) => app.education)),
  ];
  const statuses = ["Applied", "Interviewing", "Hired", "Rejected"];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  useEffect(() => {
    const filteredApplications = applications.filter((application) => {
      // Search text filter (searches through name, email, and skills)
      const searchMatch =
        !filters.searchText ||
        application.name
          .toLowerCase()
          .includes(filters.searchText.toLowerCase()) ||
        application.email
          .toLowerCase()
          .includes(filters.searchText.toLowerCase()) ||
        application.skills
          .toLowerCase()
          .includes(filters.searchText.toLowerCase());

      // City filter
      const cityMatch = !filters.city || application.city === filters.city;

      // CV Score range filter
      const cvScoreMatch =
        (!filters.minCvScore ||
          application.cvScore >= Number(filters.minCvScore)) &&
        (!filters.maxCvScore ||
          application.cvScore <= Number(filters.maxCvScore));

      // Education level filter
      const educationMatch =
        !filters.education || application.education === filters.education;

      // Experience filter
      const experienceMatch =
        !filters.minExperience ||
        application.experience >= Number(filters.minExperience);

      // Status filter
      const statusMatch =
        filters.status === "All Statuses" ||
        !filters.status ||
        application.status === filters.status;

      return (
        searchMatch &&
        cityMatch &&
        cvScoreMatch &&
        educationMatch &&
        experienceMatch &&
        statusMatch
      );
    });

    onFilteredResults(filteredApplications);
  }, [filters, applications]);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name, email, or skills..."
            className="pl-8"
            value={filters.searchText}
            onChange={(e) => handleFilterChange("searchText", e.target.value)}
          />
        </div>

        {/* Toggle Advanced Filters Button */}
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
        </Button>

        {/* Reset Filters Button */}
        <Button variant="outline" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* City Filter */}
          <Select
            value={filters.city}
            onValueChange={(value) => handleFilterChange("city", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Education Level Filter */}
          <Select
            value={filters.education}
            onValueChange={(value) => handleFilterChange("education", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by education" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Education Levels</SelectItem>
              {educationLevels.map((edu) => (
                <SelectItem key={edu} value={edu}>
                  {edu}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* CV Score Range */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min Score"
              value={filters.minCvScore}
              onChange={(e) => handleFilterChange("minCvScore", e.target.value)}
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder="Max Score"
              value={filters.maxCvScore}
              onChange={(e) => handleFilterChange("maxCvScore", e.target.value)}
              className="w-1/2"
            />
          </div>

          {/* Min Experience Filter */}
          <Input
            type="number"
            placeholder="Min Years of Experience"
            value={filters.minExperience}
            onChange={(e) =>
              handleFilterChange("minExperience", e.target.value)
            }
          />

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ApplicationFilters;
