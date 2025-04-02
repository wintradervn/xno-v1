"use client";
import Star from "@/icons/Star";
import Button from "./ui/Button";
import useFavorites from "@/hooks/useFavorites";
import FilledStar from "@/icons/FilledStar";
import React from "react";
import { cn } from "@/lib/utils";

function FavoriteStarButton({
  symbol,
  size = 20,
}: {
  symbol?: string;
  size?: number;
}) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorited = favorites?.includes(symbol);
  if (!symbol) return null;
  return (
    <Button
      isIconOnly
      size="sm"
      variant="light"
      radius="full"
      className={cn(
        "h-fit w-fit min-w-0 bg-transparent! p-1",
        isFavorited ? "!text-yellow" : "text-muted hover:text-foreground",
      )}
      onClick={() => {
        if (isFavorited) {
          removeFavorite(symbol);
        } else {
          addFavorite(symbol);
        }
      }}
    >
      {isFavorited ? <FilledStar size={size} /> : <Star size={size} />}
    </Button>
  );
}
export default React.memo(FavoriteStarButton);
