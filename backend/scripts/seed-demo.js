import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Post from "../models/posts.model.js";

dotenv.config({path: process.env.DOTENV_CONFIG_PATH || ".env"});

const demoPassword = "ProConnectDemo!2026";
const demoTag = "[ProConnect demo]";

const people = [
    {
        name: "Aarav Mehta",
        username: "aarav.mehta",
        email: "aarav.mehta@proconnect.demo",
        bio: "Product designer focused on calm, useful experiences for modern teams.",
        currentPost: "Senior Product Designer at Northstar Labs",
        pastWork: [{company: "Brightline", position: "Product Designer", years: "4"}],
        education: [{school: "National Institute of Design", degree: "B.Des", fieldOfStudy: "Interaction Design"}],
    },
    {
        name: "Maya Rodriguez",
        username: "maya.rodriguez",
        email: "maya.rodriguez@proconnect.demo",
        bio: "Growth strategist helping early-stage companies turn insight into momentum.",
        currentPost: "Growth Lead at Orbit Health",
        pastWork: [{company: "Pioneer Ventures", position: "Growth Manager", years: "5"}],
        education: [{school: "University of Texas", degree: "BBA", fieldOfStudy: "Marketing"}],
    },
    {
        name: "Liam Chen",
        username: "liam.chen",
        email: "liam.chen@proconnect.demo",
        bio: "Full-stack engineer building reliable tools that make complex work feel simple.",
        currentPost: "Staff Engineer at Cloudframe",
        pastWork: [{company: "Maple Systems", position: "Software Engineer", years: "6"}],
        education: [{school: "University of Waterloo", degree: "B.Math", fieldOfStudy: "Computer Science"}],
    },
    {
        name: "Priya Nair",
        username: "priya.nair",
        email: "priya.nair@proconnect.demo",
        bio: "People leader passionate about inclusive teams, coaching, and sustainable growth.",
        currentPost: "Head of People at Goodwork",
        pastWork: [{company: "Kindred", position: "People Partner", years: "7"}],
        education: [{school: "Tata Institute of Social Sciences", degree: "M.A.", fieldOfStudy: "Human Resources"}],
    },
    {
        name: "Noah Williams",
        username: "noah.williams",
        email: "noah.williams@proconnect.demo",
        bio: "Independent filmmaker and storyteller exploring technology, culture, and identity.",
        currentPost: "Creative Director at Framehouse",
        pastWork: [{company: "West End Studio", position: "Director", years: "8"}],
        education: [{school: "NYU Tisch", degree: "B.F.A.", fieldOfStudy: "Film and Television"}],
    },
    {
        name: "Sofia Petrov",
        username: "sofia.petrov",
        email: "sofia.petrov@proconnect.demo",
        bio: "Data scientist translating messy questions into decisions teams can trust.",
        currentPost: "Lead Data Scientist at SignalWorks",
        pastWork: [{company: "Data Harbour", position: "Data Scientist", years: "5"}],
        education: [{school: "ETH Zurich", degree: "M.Sc.", fieldOfStudy: "Data Science"}],
    },
    {
        name: "Ethan Okafor",
        username: "ethan.okafor",
        email: "ethan.okafor@proconnect.demo",
        bio: "Founder, mentor, and operator helping mission-driven products find their audience.",
        currentPost: "Founder at Common Ground",
        pastWork: [{company: "Launchpad", position: "Venture Partner", years: "9"}],
        education: [{school: "University of Lagos", degree: "B.Sc.", fieldOfStudy: "Computer Engineering"}],
    },
];

const postBodies = [
    "A thoughtful onboarding flow is not decoration. It is the first promise a product makes to a new user.",
    "The best career advice I have received: build relationships before you need them.",
    "Shipping a smaller version today taught us more than polishing a bigger version for another month.",
    "Proud of our team for turning six weeks of customer interviews into a much clearer roadmap.",
    "A good meeting ends with a decision, an owner, and a next step. Everything else is optional.",
    "Design critique works best when we critique the work, not the person who made it.",
    "Today I am celebrating a quiet milestone: my first month mentoring a new engineer.",
    "The most useful metric is often the one that changes what the team does next.",
    "Remote collaboration improves when teams write down context instead of assuming everyone has it.",
    "A strong professional network is built through generous introductions and useful conversations.",
    "We are hiring people who are curious, kind, and comfortable saying, 'I do not know yet.'",
    "Data is only valuable when it helps someone make a better decision with confidence.",
    "A reminder for founders: your first version is a learning instrument, not a final verdict.",
    "Creative work gets better when the brief leaves room for surprising answers.",
    "The best product roadmap balances customer pain, business reality, and room to experiment.",
    "Grateful for the teammates who ask the hard questions early enough to matter.",
    "Small improvements compound: one clearer email, one faster flow, one better handoff.",
    "This week I learned that listening for the question behind the question changes everything.",
    "Building in public has made our community part of the product, not just an audience for it.",
    "What is one skill you are intentionally practicing this quarter?",
];

async function seedDemo() {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGO_DB_URI;
    if (!mongoUrl) {
        throw new Error("MONGO_URL (or legacy MONGO_DB_URI) is required before running the demo seed.");
    }

    await mongoose.connect(mongoUrl);
    const password = await bcrypt.hash(demoPassword, 10);
    const users = [];

    for (const person of people) {
        const user = await User.findOneAndUpdate(
            {username: person.username},
            {
                $set: {
                    name: person.name,
                    email: person.email,
                    password,
                    active: true,
                    profilePicture: "default.jpg",
                },
                $setOnInsert: {token: ""},
            },
            {upsert: true, new: true}
        );

        await Profile.findOneAndUpdate(
            {userId: user._id},
            {$set: {
                bio: person.bio,
                currentPost: person.currentPost,
                pastWork: person.pastWork,
                education: person.education,
            }},
            {upsert: true}
        );
        users.push(user);
    }

    await Post.deleteMany({body: {$regex: `^${demoTag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`}});

    const now = Date.now();
    const posts = postBodies.map((body, index) => ({
        userId: users[index % users.length]._id,
        body: `${demoTag} ${body}`,
        likes: (index * 7 + 3) % 47,
        createdAt: new Date(now - index * 1000 * 60 * 60 * 11),
        updatedAt: new Date(now - index * 1000 * 60 * 60 * 11),
        media: "",
        active: true,
        fileType: "",
    }));

    await Post.insertMany(posts);
    await mongoose.disconnect();

    console.log(`Seeded ${users.length} demo users and ${posts.length} demo posts.`);
    console.log(`Demo login password for all users: ${demoPassword}`);
}

seedDemo().catch(async (error) => {
    console.error("Unable to seed demo data:", error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
});
