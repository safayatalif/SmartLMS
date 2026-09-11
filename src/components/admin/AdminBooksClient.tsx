"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { BookCover, TierPill } from "@/components/BookCover";
import { Field, Modal, TextArea, useActionToast } from "@/components/admin/FormBits";
import {
  createBookAction,
  deleteBookAction,
  updateBookAction,
  type ActionState,
} from "@/lib/actions/books";
import { useI18n } from "@/lib/i18n";
import type { Book, Plan } from "@/lib/types";
import { planLabel } from "@/lib/types";

const empty: ActionState = {};

export function AdminBooksClient({ books, plans }: { books: Book[]; plans: Plan[] }) {
  const { t, lang } = useI18n();
  const { msg, setMsg } = useActionToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [pending, startTransition] = useTransition();

  const [createState, createAction, createPending] = useActionState(createBookAction, empty);
  const [updateState, updateAction, updatePending] = useActionState(updateBookAction, empty);

  useEffect(() => {
    if (createState.ok) {
      setOpen(false);
      setMsg("Book saved.");
    } else if (createState.error) setMsg(createState.error);
  }, [createState, setMsg]);

  useEffect(() => {
    if (updateState.ok) {
      setEditing(null);
      setMsg("Book updated.");
    } else if (updateState.error) setMsg(updateState.error);
  }, [updateState, setMsg]);

  function onDelete(slug: string) {
    if (!confirm("Delete this book?")) return;
    startTransition(async () => {
      const res = await deleteBookAction(slug);
      setMsg(res.error || "Book deleted.");
    });
  }

  const formBook = editing;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold">{t.nav.admin}</p>
          <h1 className="font-display mt-1 text-4xl">{t.admin.books}</h1>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-ink px-4 py-2 text-sm text-paper"
        >
          {t.admin.addBook}
        </button>
      </div>
      {msg ? <p className="mt-3 text-sm text-wine">{msg}</p> : null}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[0_8px_24px_rgba(28,22,18,0.04)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-paper-2/50 text-[11px] uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3.5 font-normal">Title</th>
              <th className="px-5 py-3.5 font-normal">Plan</th>
              <th className="px-5 py-3.5 font-normal">{t.admin.copies}</th>
              <th className="px-5 py-3.5 font-normal">{t.admin.loaned}</th>
              <th className="px-5 py-3.5 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-t border-ink/8 hover:bg-paper/60">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10">
                      <BookCover title={book.title[lang]} palette={book.palette} compact />
                    </div>
                    <div>
                      <p>{book.title[lang]}</p>
                      <p className="text-xs text-ink-soft">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <TierPill tier={book.tier} label={planLabel(plans, book.tier, lang)} />
                </td>
                <td className="px-5 py-3.5">{book.copies}</td>
                <td className="px-5 py-3.5">{book.borrowed}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs text-wine underline-offset-2 hover:underline"
                      onClick={() => setEditing(book)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      className="text-xs text-ink-soft underline-offset-2 hover:underline"
                      onClick={() => onDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={t.admin.addBook} onClose={() => setOpen(false)}>
        <BookForm action={createAction} plans={plans} pending={createPending} />
      </Modal>

      <Modal open={!!editing} title="Edit book" onClose={() => setEditing(null)}>
        {formBook ? (
          <BookForm action={updateAction} plans={plans} book={formBook} pending={updatePending} />
        ) : null}
      </Modal>
    </div>
  );
}

function BookForm({
  action,
  plans,
  book,
  pending,
}: {
  action: (payload: FormData) => void;
  plans: Plan[];
  book?: Book;
  pending: boolean;
}) {
  return (
    <form action={action} className="grid gap-3">
      {book ? <input type="hidden" name="slug" value={book.id} /> : null}
      {!book ? <Field label="Slug (optional)" name="slug" /> : null}
      <Field label="Title (EN)" name="titleEn" defaultValue={book?.title.en} required />
      <Field label="Title (BN)" name="titleBn" defaultValue={book?.title.bn} />
      <Field label="Author" name="author" defaultValue={book?.author} required />
      <Field label="Category (EN)" name="categoryEn" defaultValue={book?.category.en} />
      <Field label="Category (BN)" name="categoryBn" defaultValue={book?.category.bn} />
      <label className="block text-sm">
        Plan tier
        <select
          name="tier"
          defaultValue={book?.tier || "basic"}
          className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-3 py-2"
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name.en}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Pages" name="pages" type="number" defaultValue={book?.pages ?? 100} />
        <Field label="Year" name="year" type="number" defaultValue={book?.year ?? 2024} />
        <Field label="Rating" name="rating" type="number" step="0.1" defaultValue={book?.rating ?? 4.5} />
        <Field label="Copies" name="copies" type="number" defaultValue={book?.copies ?? 1} />
        <Field label="Borrowed" name="borrowed" type="number" defaultValue={book?.borrowed ?? 0} />
      </div>
      <TextArea label="Summary (EN)" name="summaryEn" defaultValue={book?.summary.en} />
      <TextArea label="Summary (BN)" name="summaryBn" defaultValue={book?.summary.bn} />
      <div className="grid grid-cols-3 gap-2">
        <Field label="Color 1" name="color1" defaultValue={book?.palette[0] || "#7a2e3a"} />
        <Field label="Color 2" name="color2" defaultValue={book?.palette[1] || "#f3eee4"} />
        <Field label="Color 3" name="color3" defaultValue={book?.palette[2] || "#1c1612"} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-ink py-2.5 text-sm text-paper disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
