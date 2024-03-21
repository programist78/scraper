"use client"
import { FC } from 'react';
import { useRouter } from '@/node_modules/next/navigation';

interface ScraperButtonProps { }

export const ScraperButton: FC<ScraperButtonProps> = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/?runScrapper=${true}`)

    setTimeout(() => {
      router.push('/')
    }, 5000)
  }

  const handleClickWebsite = () => {
    router.push(`/?runWebsiteScrapper=${true}`)

    setTimeout(() => {
      router.push('/')
    }, 5000)
  }

  const handleClickProfile = () => {
    router.push(`/?runProfileScrapper=${true}`)

    setTimeout(() => {
      router.push('/')
    }, 5000)
  }

  return (
    <div>
      <button onClick={handleClick}>
        Run
      </button>
      <div>
        <button onClick={handleClickWebsite}>
          Run Scrap Website
        </button>
      </div>
      <div>
        <button onClick={handleClickProfile}>
          Run Scrap Website from Profile
        </button>
      </div>
    </div>
  );
};
