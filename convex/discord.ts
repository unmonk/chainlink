import { formatDistanceToNow } from "date-fns";
import { api } from "./_generated/api";
import { action } from "./_generated/server";
import { announcement_type } from "./schema";
import { v } from "convex/values";

interface DiscordWebhookPayload {
  content?: string;
  username?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
  thread_name?: string;
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  author?: {
    name: string;
    url: string;
    icon_url: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  thumbnail?: {
    url: string | undefined;
  };
  image?: {
    url: string | undefined;
  };
  footer?: {
    text: string;
    icon_url?: string;
  };
}

export const sendNewsNotification = action({
  args: {
    title: v.string(),
    description: v.string(),
    type: announcement_type,
    url: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, news) => {
    const embed: DiscordEmbed = {
      title: news.title,
      url: news.url || "https://chainlink.st",
      description: news.description,
      color: 4321431,
      author: {
        name: "ChainMaster",
        url: "https://chainlink.st",
        icon_url: "https://chainlink.st/icons/favicon-32x32.png",
      },
      thumbnail: {
        url: "https://chainlink.st/icons/favicon-32x32.png",
      },
      image: {
        url: news.image,
      },
      fields: [
        {
          name: "Announcement Type",
          value: news.type,
          inline: true,
        },
      ],
    };

    const payload: DiscordWebhookPayload = {
      embeds: [embed],
      username: "ChainMaster",
      avatar_url: "https://chainlink.st/icons/icon-192x192.png",
    };

    await sendDiscordWebhook(payload);

    return;
  },
});

export const sendNextChainBuilderNotification = action({
  args: {},
  handler: async (ctx) => {
    const matchup = await ctx.runQuery(api.matchups.getNextChainBuilderMatchup);

    if (!matchup) {
      return;
    }

    const embed: DiscordEmbed = {
      title: "Next available **ChainBuilder** matchup",
      url: "https://chainlink.st/play",
      description: `***${matchup.title}***`,
      color: 4321431,
      author: {
        name: "ChainMaster",
        url: "https://chainlink.st",
        icon_url: "https://chainlink.st/icons/favicon-32x32.png",
      },
      thumbnail: {
        url: matchup.homeTeam.image,
      },
      image: {
        url: "https://i.ibb.co/mt0py9M/discordchainbuilderembed.png",
      },
      footer: {
        text: `Starts ${formatDistanceToNow(new Date(matchup.startTime), {
          addSuffix: true,
        })}`,
      },
      fields: [
        {
          name: "Away",
          value: matchup.awayTeam.name,
          inline: true,
        },
        {
          name: "Home",
          value: matchup.homeTeam.name,
          inline: true,
        },
      ],
    };
    const payload: DiscordWebhookPayload = {
      embeds: [embed],
      username: "ChainMaster",
      avatar_url: "https://chainlink.st/icons/icon-192x192.png",
    };

    await sendDiscordWebhook(payload);

    return;
  },
});

export const sendNext3ChainBuilderNotification = action({
  args: {},
  handler: async (ctx) => {
    const matchups = await ctx.runQuery(
      api.matchups.getNext3ChainBuilderMatchups
    );

    if (!matchups) {
      return;
    }

    const embed: DiscordEmbed = {
      title: "Next available **ChainBuilder** matchups",
      url: "https://chainlink.st/play",
      color: 4321431,
      author: {
        name: "ChainMaster",
        url: "https://chainlink.st",
        icon_url: "https://chainlink.st/icons/favicon-32x32.png",
      },
      image: {
        url: "https://i.ibb.co/mt0py9M/discordchainbuilderembed.png",
      },
      fields: matchups.map((matchup) => ({
        name: matchup.title,
        value: `Starts ${formatDistanceToNow(new Date(matchup.startTime), {
          addSuffix: true,
        })}`,
        inline: true,
      })),
    };
    const payload: DiscordWebhookPayload = {
      embeds: [embed],
      username: "ChainMaster",
      avatar_url: "https://chainlink.st/icons/icon-192x192.png",
    };

    await sendDiscordWebhook(payload);

    return;
  },
});

async function sendDiscordWebhook(payload: DiscordWebhookPayload) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("DISCORD_WEBHOOK_URL is not set");
  }
  try {
    return await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(error);
  }
}
