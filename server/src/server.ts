import express from "express";
import cors from "cors";

import { PrismaClient } from "prisma/prisma-client";
import { converHoursStringToMinutes } from "./utils/convert-hours-string-to-minutes";
import { converMinutesToHourString } from "./utils/convert-minutes-hours-string";

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: { ads: true },
      },
    },
  });
  return res.status(200).json(games);
});

app.post("/games/:gameId/ads", async (req, res) => {
  const gameId = req.params.gameId;
  const { name, weekDays, hourStart, hourEnd, useVoiceChannel, yearsPlaying, discord } = req.body;

  const ad = await prisma.ad.create({
      data: {
        gameId,
        name,
        yearsPlaying,
        discord,
        weekDays: weekDays.join(','),
        hourStart: converHoursStringToMinutes(hourStart),
        hourEnd: converHoursStringToMinutes(hourEnd),
        useVoiceChannel,
      }
  });

  return res.status(201).json(ad);
});

app.get("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      hourStart: true,
      hourEnd: true,
      useVoiceChannel: true,
      yearsPlaying: true,
    },
    where: {
      gameId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })


  return res.status(200).json(ads.map(ad => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(',').map(day => day),
        hourStart: converMinutesToHourString(ad.hourStart),
        hourEnd: converMinutesToHourString(ad.hourEnd)
      }
    }  
  ));
});

app.get("/ads/:id/discord", async (req, res) => {
  const adId = req.params.id;

  const discord = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true
    },
    where: {
      id: adId
    }
  })

  return res.status(200).json(discord);
});

app.listen(3333, () => {
  console.log("Server is running!");
});
