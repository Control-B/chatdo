import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create demo users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: {
        email: "alice@example.com",
        name: "Alice Johnson",
        password: await bcrypt.hash("password123", 12),
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: {
        email: "bob@example.com",
        name: "Bob Smith",
        password: await bcrypt.hash("password123", 12),
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.upsert({
      where: { email: "charlie@example.com" },
      update: {},
      create: {
        email: "charlie@example.com",
        name: "Charlie Brown",
        password: await bcrypt.hash("password123", 12),
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
    }),
  ]);

  console.log(
    "✅ Created users:",
    users.map((u) => u.name)
  );

  // Create demo workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: {
      name: "Demo Workspace",
      slug: "demo-workspace",
      description: "A demo workspace for testing the chat application",
      ownerId: users[0].id,
      members: {
        create: [
          { userId: users[0].id, role: "owner" },
          { userId: users[1].id, role: "admin" },
          { userId: users[2].id, role: "member" },
        ],
      },
    },
  });

  console.log("✅ Created workspace:", workspace.name);

  // Create demo channels
  const channels = await Promise.all([
    prisma.channel.create({
      data: {
        workspaceId: workspace.id,
        name: "general",
        description: "General discussion for the workspace",
        isPrivate: false,
        members: {
          create: [
            { userId: users[0].id },
            { userId: users[1].id },
            { userId: users[2].id },
          ],
        },
      },
    }),
    prisma.channel.create({
      data: {
        workspaceId: workspace.id,
        name: "random",
        description: "Random topics and fun discussions",
        isPrivate: false,
        members: {
          create: [{ userId: users[0].id }, { userId: users[1].id }],
        },
      },
    }),
    prisma.channel.create({
      data: {
        workspaceId: workspace.id,
        name: "private-admin",
        description: "Private channel for admins only",
        isPrivate: true,
        members: {
          create: [{ userId: users[0].id }, { userId: users[1].id }],
        },
      },
    }),
  ]);

  console.log(
    "✅ Created channels:",
    channels.map((c) => c.name)
  );

  // Create demo messages
  const messages = await Promise.all([
    prisma.message.create({
      data: {
        channelId: channels[0].id,
        roomType: "channel",
        authorId: users[0].id,
        content: "Welcome to the demo workspace! 👋",
      },
    }),
    prisma.message.create({
      data: {
        channelId: channels[0].id,
        roomType: "channel",
        authorId: users[1].id,
        content: "Thanks Alice! This looks great!",
      },
    }),
    prisma.message.create({
      data: {
        channelId: channels[0].id,
        roomType: "channel",
        authorId: users[2].id,
        content: "Hello everyone! Happy to be here.",
      },
    }),
    prisma.message.create({
      data: {
        channelId: channels[1].id,
        roomType: "channel",
        authorId: users[0].id,
        content: "Anyone up for some random chat? 😄",
      },
    }),
    prisma.message.create({
      data: {
        channelId: channels[1].id,
        roomType: "channel",
        authorId: users[1].id,
        content: "Always! What's on your mind?",
      },
    }),
  ]);

  console.log("✅ Created messages:", messages.length);

  // Create demo DM thread
  const dmThread = await prisma.dMThread.create({
    data: {
      workspaceId: workspace.id,
      participants: [users[0].id, users[1].id],
    },
  });

  const dmMessages = await Promise.all([
    prisma.message.create({
      data: {
        dmThreadId: dmThread.id,
        roomType: "dm",
        authorId: users[0].id,
        content: "Hey Bob, can we discuss the project privately?",
      },
    }),
    prisma.message.create({
      data: {
        dmThreadId: dmThread.id,
        roomType: "dm",
        authorId: users[1].id,
        content: "Of course! What's on your mind?",
      },
    }),
  ]);

  console.log("✅ Created DM thread with messages");

  // Create some read receipts
  await Promise.all([
    prisma.readReceipt.create({
      data: {
        channelId: channels[0].id,
        roomType: "channel",
        userId: users[0].id,
        messageId: messages[2].id,
        lastSeenAt: new Date(),
      },
    }),
    prisma.readReceipt.create({
      data: {
        channelId: channels[0].id,
        roomType: "channel",
        userId: users[1].id,
        messageId: messages[2].id,
        lastSeenAt: new Date(),
      },
    }),
  ]);

  console.log("✅ Created read receipts");

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📋 Demo Data Summary:");
  console.log(
    `- Users: ${users.length} (alice@example.com, bob@example.com, charlie@example.com)`
  );
  console.log(`- Workspace: ${workspace.name}`);
  console.log(
    `- Channels: ${channels.length} (general, random, private-admin)`
  );
  console.log(`- Messages: ${messages.length + dmMessages.length}`);
  console.log(`- DM Thread: 1 (Alice ↔ Bob)`);
  console.log("\n🔑 Login credentials:");
  console.log("- Email: alice@example.com, Password: password123");
  console.log("- Email: bob@example.com, Password: password123");
  console.log("- Email: charlie@example.com, Password: password123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
