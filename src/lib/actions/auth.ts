"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { findUserByLogin } from "@/lib/data";

export type AuthState = { error?: string; ok?: boolean };

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const login = String(formData.get("login") || "").trim();
  const password = String(formData.get("password") || "");
  if (!login || !password) return { error: "Enter ID/email and password." };

  const user = await findUserByLogin(login);
  if (!user) return { error: "Invalid credentials." };

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return { error: "Invalid credentials." };

  const session = await getSession();
  session.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    studentId: user.student_id,
    department: user.department,
  };
  await session.save();

  redirect(user.role === "ADMIN" ? "/admin" : "/books");
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const studentId = String(formData.get("studentId") || "").trim();
  const department = String(formData.get("department") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!name || !studentId || !email || !password) {
    return { error: "Name, student ID, email, and password are required." };
  }
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const hash = await bcrypt.hash(password, 10);

  try {
    const { rows } = await query<{ id: string }>(
      `INSERT INTO users (email, student_id, password_hash, role, name, department, phone)
       VALUES ($1,$2,$3,'STUDENT',$4,$5,$6)
       RETURNING id`,
      [email, studentId, hash, name, department || null, phone || null],
    );
    await query(
      `INSERT INTO members (user_id, name, email, plan_id, status, books_count)
       VALUES ($1,$2,$3,'basic','active',0)`,
      [rows[0].id, name, email],
    );

    const session = await getSession();
    session.user = {
      id: rows[0].id,
      email,
      name,
      role: "STUDENT",
      studentId,
      department: department || null,
    };
    await session.save();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { error: "Email or student ID already registered." };
    }
    return { error: "Could not create account." };
  }

  redirect("/books");
}

export async function signOutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/sign-in");
}
