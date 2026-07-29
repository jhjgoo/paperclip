import { useEffect, useId, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, LoaderCircle, Save, Trash2, UserRoundPen } from "lucide-react";
import type { AuthSession, CurrentUserProfile, UpdateCurrentUserProfile } from "@paperclipai/shared";
import { authApi } from "@/api/auth";
import { assetsApi } from "@/api/assets";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useCompany } from "../context/CompanyContext";
import { queryKeys } from "../lib/queryKeys";
import { InboxAgentPolicyControl } from "@/components/InboxAgentPolicyControl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setLocale, useTranslation } from "../i18n";
import type { SupportedLocale } from "../i18n/locales";

function deriveInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function ProfileSettings() {
  const { t, i18n } = useTranslation();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { selectedCompanyId, selectedCompany } = useCompany();
  const queryClient = useQueryClient();
  const avatarInputId = useId();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const sessionQuery = useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => authApi.getSession(),
    retry: false,
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: t("profile.breadcrumbs.settings"), href: "/company/settings" },
      { label: t("profile.breadcrumbs.instanceSettings"), href: "/company/settings/instance/general" },
      { label: t("profile.breadcrumbs.profile") },
    ]);
  }, [setBreadcrumbs, t]);

  useEffect(() => {
    const session = sessionQuery.data;
    if (!session) return;
    setName(session.user.name ?? "");
    setImage(session.user.image ?? "");
  }, [sessionQuery.data]);

  function syncSessionProfile(profile: CurrentUserProfile) {
    queryClient.setQueryData<AuthSession | null>(queryKeys.auth.session, (current) => {
      if (!current) return current;
      return {
        ...current,
        user: {
          ...current.user,
          ...profile,
        },
      };
    });
  }

  async function persistProfile(input: UpdateCurrentUserProfile) {
    const profile = await authApi.updateProfile(input);
    syncSessionProfile(profile);
    return profile;
  }

  function resolveProfileName() {
    return name.trim() || sessionQuery.data?.user.name || t("profile.defaultName");
  }

  const updateMutation = useMutation({
    mutationFn: (input: UpdateCurrentUserProfile) => persistProfile(input),
    onSuccess: (profile) => {
      setActionError(null);
      setName(profile.name ?? "");
      setImage(profile.image ?? "");
    },
    onError: (error) => {
      setActionError(error instanceof Error ? error.message : t("profile.updateFailed"));
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!selectedCompanyId) {
        throw new Error(t("profile.selectCompanyToUpload"));
      }

      const asset = await assetsApi.uploadImage(
        selectedCompanyId,
        file,
        `profiles/${sessionQuery.data?.user.id ?? "board-user"}`,
      );
      return persistProfile({ name: resolveProfileName(), image: asset.contentPath });
    },
    onSuccess: (profile) => {
      setActionError(null);
      setName(profile.name ?? "");
      setImage(profile.image ?? "");
    },
    onError: (error) => {
      setActionError(error instanceof Error ? error.message : t("profile.uploadFailed"));
    },
  });

  const removeAvatarMutation = useMutation({
    mutationFn: () => persistProfile({ name: resolveProfileName(), image: null }),
    onSuccess: (profile) => {
      setActionError(null);
      setName(profile.name ?? "");
      setImage(profile.image ?? "");
    },
    onError: (error) => {
      setActionError(error instanceof Error ? error.message : t("profile.updateFailed"));
    },
  });

  if (sessionQuery.isLoading) {
    return <div className="text-sm text-muted-foreground">{t("profile.loading")}</div>;
  }

  if (sessionQuery.error || !sessionQuery.data) {
    return (
      <div className="text-sm text-destructive">
        {sessionQuery.error instanceof Error ? sessionQuery.error.message : t("profile.loadFailed")}
      </div>
    );
  }

  const currentName = name.trim() || sessionQuery.data.user.name || t("profile.defaultName");
  const currentImage = image.trim() || null;
  const initials = deriveInitials(currentName);
  const isSavingProfile = updateMutation.isPending || uploadAvatarMutation.isPending || removeAvatarMutation.isPending;
  const uploadHint = selectedCompany
    ? t("profile.uploadHint.withCompany", { company: selectedCompany.name })
    : t("profile.uploadHint.withoutCompany");
  const selectedLocale = i18n.resolvedLanguage === "en" ? "en" : "zh-CN";

  return (
    <div className="max-w-4xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <UserRoundPen className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">{t("profile.title")}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("profile.description")}
        </p>
      </div>

      {actionError ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {actionError}
        </div>
      ) : null}

      <section className="space-y-8">
        <Card className="block relative overflow-hidden rounded-(--rad-28) border-border/70">
          <div className="absolute inset-x-0 top-0 h-32 bg-(image:--gradient-extract-26)" />
          <div className="absolute inset-0 bg-(image:--gradient-extract-7)" />
          <div className="relative p-6 pt-10">
            <div className="flex flex-wrap items-end gap-5 rounded-(--rad-24) border border-border/70 bg-background/92 p-5 shadow-(--shadow-extract-18) backdrop-blur-sm">
              <div className="space-y-3">
                <label
                  htmlFor={avatarInputId}
                  className="group relative block cursor-pointer rounded-full focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
                >
                  <input
                    ref={avatarInputRef}
                    id={avatarInputId}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={!selectedCompanyId || isSavingProfile}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      uploadAvatarMutation.mutate(file);
                      event.target.value = "";
                    }}
                  />
                  <span className="absolute inset-0 z-10 rounded-full bg-black/0 transition-colors group-hover:bg-black/14 group-focus-within:bg-black/14" />
                  <span className="absolute bottom-1 right-1 z-20 flex size-9 items-center justify-center rounded-full border border-background bg-primary text-primary-foreground shadow-sm">
                    {uploadAvatarMutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Camera className="size-4" />}
                  </span>
                  <Avatar size="lg" className="data-[size=lg]:size-24 ring-4 ring-background shadow-xl">
                    {currentImage ? <AvatarImage src={currentImage} alt={currentName} /> : null}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={!selectedCompanyId || isSavingProfile}
                  >
                    {uploadAvatarMutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Camera className="size-4" />}
                    {currentImage ? t("profile.avatar.change") : t("profile.avatar.upload")}
                  </Button>
                  {currentImage ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeAvatarMutation.mutate()}
                      disabled={isSavingProfile}
                    >
                      {removeAvatarMutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                      {t("profile.avatar.remove")}
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-2 pb-1">
                <div>
                  <h2 className="truncate text-2xl font-semibold text-foreground">{currentName}</h2>
                  <p className="truncate text-sm text-muted-foreground">{sessionQuery.data.user.email ?? t("profile.noEmail")}</p>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  {t("profile.avatar.hint", { uploadHint })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <form
          className="grid gap-6 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            updateMutation.mutate({ name: resolveProfileName(), image: image.trim() || null });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="profile-name">{t("profile.displayName.label")}</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={120}
              placeholder={t("profile.defaultName")}
            />
            <p className="text-xs text-muted-foreground">
              {t("profile.displayName.hint")}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email">{t("profile.email.label")}</Label>
            <Input
              id="profile-email"
              value={sessionQuery.data.user.email ?? ""}
              readOnly
              disabled
            />
            <p className="text-xs text-muted-foreground">
              {t("profile.email.hint")}
            </p>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={isSavingProfile || !name.trim()}>
              {updateMutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
              {updateMutation.isPending ? t("profile.save.saving") : t("profile.save.action")}
            </Button>
          </div>
        </form>

        <Card className="rounded-(--rad-28) border-border/70 p-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold">{t("profile.language.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("profile.language.description")}</p>
            </div>
            <div className="max-w-sm space-y-2">
              <Label htmlFor="profile-language">{t("profile.language.label")}</Label>
              <select
                id="profile-language"
                value={selectedLocale}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                onChange={(event) => {
                  void setLocale(event.target.value as SupportedLocale);
                }}
              >
                <option value="zh-CN">{t("profile.language.zhCN")}</option>
                <option value="en">{t("profile.language.en")}</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="rounded-(--rad-28) border-border/70 p-6">
          <InboxAgentPolicyControl companyId={selectedCompanyId} />
        </Card>
      </section>
    </div>
  );
}
