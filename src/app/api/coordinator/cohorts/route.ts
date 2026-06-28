import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all cohorts
export async function GET() {
  try {
    const cohorts = await prisma.cohort.findMany({
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ cohorts });
  } catch (error) {
    console.error("Fetch cohorts error:", error);
    return NextResponse.json({ error: "Failed to fetch cohorts" }, { status: 500 });
  }
}

// POST - Create a new cohort
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, academic_year } = body;

    // Validate required fields
    if (!name || !academic_year) {
      return NextResponse.json(
        { error: "Name and academic year are required" },
        { status: 400 }
      );
    }

    // Create cohort (NO is_active field)
    const cohort = await prisma.cohort.create({
      data: {
        name,
        academic_year,
      },
    });

    return NextResponse.json({ cohort, message: "Cohort created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Create cohort error:", error);
    return NextResponse.json({ error: "Failed to create cohort" }, { status: 500 });
  }
}

// PUT - Update a cohort
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, academic_year } = body;

    if (!id) {
      return NextResponse.json({ error: "Cohort ID is required" }, { status: 400 });
    }

    const cohort = await prisma.cohort.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(academic_year && { academic_year }),
      },
    });

    return NextResponse.json({ cohort, message: "Cohort updated successfully" });
  } catch (error) {
    console.error("Update cohort error:", error);
    return NextResponse.json({ error: "Failed to update cohort" }, { status: 500 });
  }
}