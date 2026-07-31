import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { signInSchema, type SignInFormValues } from "@/lib/validation";
import { useAppStore } from "@/lib/store";

/**
 * MVP-only local "auth": creates/loads a profile by email in this browser.
 * There is no password, session token, or server verification here — see
 * README.md "Known limitations" for how this seam is meant to be replaced
 * by Supabase Auth or Clerk behind the same `signIn` store action.
 */
export function SignIn() {
  const navigate = useNavigate();
  const signIn = useAppStore((s) => s.signIn);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = handleSubmit(async (values) => {
    signIn(values.email, values.displayName);
    navigate("/today");
  });

  return (
    <div className="mx-auto min-h-dvh max-w-app px-6 py-10">
      <PageHeader title="Sign in" subtitle="Local to this device for this demo build." back />
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Email
          <input
            type="email"
            autoComplete="email"
            className="rounded-xl border border-line px-3 py-2.5 text-[15px] outline-none focus:border-sprout-400"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" role="alert" className="text-xs text-alert">
              {errors.email.message}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          What should we call you? (optional)
          <input
            type="text"
            autoComplete="name"
            className="rounded-xl border border-line px-3 py-2.5 text-[15px] outline-none focus:border-sprout-400"
            {...register("displayName")}
          />
        </label>
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          Continue
        </Button>
      </form>
    </div>
  );
}
