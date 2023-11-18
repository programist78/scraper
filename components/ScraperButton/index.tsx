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

  return (
    <button onClick={handleClick}>
      Run
    </button>
  );
};