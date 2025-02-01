import React, { useEffect, useState } from "react";
import supabaseClient from "@/utils/supabase";
import { BarLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalApplications: 0,
    totalJobPosts: 0,
    totalCompanies: 0,
    totalUsers: 0,
    totalRecruiters: 0,
    totalCandidates: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      const supabase = await supabaseClient();

      const { data: applicationsData, error: applicationsError } =
        await supabase.from("applications").select("id", { count: "exact" });

      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("id", { count: "exact" });

      const { data: companiesData, error: companiesError } = await supabase
        .from("companies")
        .select("id", { count: "exact" });

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, role", { count: "exact" });

      if (applicationsError || jobsError || companiesError || usersError) {
        console.error(
          "Error fetching analytics data:",
          applicationsError || jobsError || companiesError || usersError
        );
        setLoading(false);
        return;
      }

      const totalRecruiters = usersData.filter(
        (user) => user.role === "recruiter"
      ).length;
      const totalCandidates = usersData.filter(
        (user) => user.role === "candidate"
      ).length;

      setAnalytics({
        totalApplications: applicationsData.length,
        totalJobPosts: jobsData.length,
        totalCompanies: companiesData.length,
        totalUsers: usersData.length,
        totalRecruiters,
        totalCandidates,
      });

      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Applications</CardTitle>
        </CardHeader>
        <CardContent>{analytics.totalApplications}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Job Posts</CardTitle>
        </CardHeader>
        <CardContent>{analytics.totalJobPosts}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Companies</CardTitle>
        </CardHeader>
        <CardContent>{analytics.totalCompanies}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>{analytics.totalUsers}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Recruiters</CardTitle>
        </CardHeader>
        <CardContent>{analytics.totalRecruiters}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Candidates</CardTitle>
        </CardHeader>
        <CardContent>{analytics.totalCandidates}</CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
