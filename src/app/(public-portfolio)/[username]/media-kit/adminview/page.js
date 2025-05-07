"use client"
import { useEffect, useState } from "react";
import { FormProvider } from "@/app/onboarding/context";
import ProfileOverview from "@/components/public-portfolio/ProfileOverview";
import LoadingTransition from "@/components/public-portfolio/LoadingTransition";
import { useFetchPortfolio, useFetchPublicPosts } from "@/utils/public-portfolio/portfolio";

function AdminPortfolioContent({ ownerId }) {
  const [isLoading, setIsLoading] = useState(true);
  const portfolioData = useFetchPortfolio(ownerId);
  const postsData = useFetchPublicPosts(ownerId);
 
  useEffect(() => {
    if (portfolioData) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [portfolioData, postsData]);

  if (isLoading) {
    return <LoadingTransition />;
  }

  return (
    <div className="h-[200vh] py-[1%] px-[1%] relative">
      <ProfileOverview ownerId={ownerId} isAdminView={true} />
    </div>
  );
}

export default function AdminPortfolioPage({ ownerId }) {
  return (
    <FormProvider>
      <AdminPortfolioContent ownerId={ownerId} />
    </FormProvider>
  );
}