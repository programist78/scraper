"use client"
import { useRouter } from '@/node_modules/next/navigation';
import { FC } from 'react';

interface ScraperButtonProps {}

export const ScraperButton: FC<ScraperButtonProps> = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/?runScrapper=${true}`)
  }

  return (
    <button onClick={handleClick}>
      index
    </button>
  );
};