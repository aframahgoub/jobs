"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/search/SearchBar";
import ResumeCard from "@/components/resume/ResumeCard";
import { searchResumes } from "@/lib/api";
import { Resume } from "@/types/database";
import { Loader2 } from "lucide-react";

export default function SearchPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});

  useEffect(() => {
    fetchResumes({ query: "" });
  }, []);

  const fetchResumes = async (searchParams: {
    query: string;
    location?: string;
    experience?: string;
    skills?: string[];
  }) => {
    setIsLoading(true);
    setError(null);
    setSearchQuery(searchParams.query);

    // Extract filters from searchParams
    const filters = {
      location: searchParams.location,
      experience: searchParams.experience,
      skills: searchParams.skills,
    };

    setActiveFilters(filters);

    try {
      const { data, error } = await searchResumes(searchParams.query, filters);

      if (error) throw error;

      setResumes(data || []);
    } catch (err: any) {
      console.error("Error searching resumes:", err);
      setError("Failed to load resumes. Please try again.");
      setResumes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getResultsText = () => {
    if (
      searchQuery ||
      Object.keys(activeFilters).some((key) => activeFilters[key]?.length)
    ) {
      return `${resumes.length} result${resumes.length !== 1 ? "s" : ""} found`;
    }
    return "Browse all beauty professionals";
  };

  return (
    <div className="min-h-screen bg-[#f1f8f9] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#18515b] mb-6">
          Find Beauty Professionals
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <SearchBar onSearch={(searchParams) => fetchResumes(searchParams)} />
        </div>

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#18515b]">
            {getResultsText()}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#00acc1]" />
            <span className="ml-2 text-[#18515b]">Loading resumes...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : resumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                id={resume.id}
                name={resume.fullname || ""}
                photoUrl={resume.photo}
                bio={resume.bio || ""}
                skills={resume.skills || []}
                title={resume.title}
                hasCv={!!resume.cv_url}
                yearsOfExperience={resume.yearsofexperience}
                location={resume.location}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">
              No resumes found matching your search criteria.
            </p>
            <p className="text-[#00acc1]">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
