"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createRenderApiClient } from "@/services/render-api";
import { LoadingState } from "@/components/LoadingState";
import { Modal } from "@/components/Modal";
import { Pagination, usePagination } from "@/components/Pagination";
import { StatusMessage } from "@/components/StatusMessage";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { interpolate } from "@/lib/i18n";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const userName = (user) => [user.name, user.raw?.UMG_Apellido].filter(Boolean).join(" ") || user.email;

export default function UsersPage() {
  const { identity, isAdmin } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [resetting, setResetting] = useState(null);
  const [deactivating, setDeactivating] = useState(null);
  const pagination = usePagination(users ?? []);

  const load = useCallback(async () => {
    setError(null);
    try { setUsers(asList(await createRenderApiClient().listUsers())); }
    catch (caught) { setUsers([]); setError(caught?.code ?? "api.network"); }
  }, []);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      if (!isAdmin) { router.replace("/portal"); return; }
      load();
    });
    return () => { active = false; };
  }, [isAdmin, load, router]);

  const run = async (work, success) => {
    setError(null); setStatus(null);
    try { await work(); setStatus(success); await load(); }
    catch (caught) { setError(caught?.code ?? "api.network"); }
  };
  const submitCreate = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    run(() => createRenderApiClient().createUser({ username: form.get("username"), password: form.get("password"), name: form.get("firstName"), lastName: form.get("lastName"), roleId: Number(form.get("roleId")) }), "users.created");
    setCreateOpen(false);
  };
  const submitReset = (event) => {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("temporaryPassword");
    run(() => createRenderApiClient().resetUserPassword({ id: resetting.id, temporaryPassword: password }), "users.passwordReset");
    setResetting(null);
  };
  const deactivate = () => {
    if (!deactivating || deactivating.id === identity.id) return;
    run(() => createRenderApiClient().deactivateUser({ id: deactivating.id }), "users.deactivated");
    setDeactivating(null);
  };
  const role = (user) => user.roleName || (user.roleId === 1 ? t("roles.admin") : t("roles.professor"));

  if (!isAdmin || users === null) return <LoadingState messageKey="loading.users" className="workflow-page" />;
  return <section className="workflow-page users-page"><header className="page-heading"><p className="eyebrow">{t("users.eyebrow")}</p><h1>{t("users.title")}</h1><p>{t("users.description")}</p></header>{error ? <StatusMessage code={error} onRetry={load} /> : null}{status ? <p className="success-message" role="status">{t(status)}</p> : null}
    <section className="data-panel users-panel" aria-labelledby="users-title"><div className="panel-heading-row"><div><h2 id="users-title">{t("users.listTitle")}</h2><p>{t("users.listDescription")}</p></div><button className="button is-primary" onClick={() => setCreateOpen(true)}>{t("users.create")}</button></div><div className="users-table-wrap"><table className="table is-fullwidth users-table"><thead><tr><th>{t("users.name")}</th><th>{t("users.email")}</th><th>{t("users.role")}</th><th>{t("users.status")}</th><th>{t("users.actions")}</th></tr></thead><tbody>{pagination.pageItems.map((user) => <tr key={user.id}><td data-label={t("users.name")}><strong>{userName(user)}</strong></td><td data-label={t("users.email")}>{user.email}</td><td data-label={t("users.role")}>{role(user)}</td><td data-label={t("users.status")}><span className={`user-status is-${user.status === 1 ? "active" : "inactive"}`}>{user.status === 1 ? t("common.active") : t("common.inactive")}</span></td><td data-label={t("users.actions")}><div className="user-actions"><button className="button is-text" onClick={() => setResetting(user)}>{t("users.reset")}</button><button className="button is-text is-danger" disabled={user.status !== 1 || user.id === identity.id} onClick={() => setDeactivating(user)}>{t("users.deactivate")}</button></div></td></tr>)}</tbody></table></div>{users.length === 0 ? <p role="status">{t("users.empty")}</p> : null}<Pagination {...pagination} totalItems={users.length} labels={t("pagination")} /></section>
    <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title={t("users.create")} closeLabel={t("common.close")}><form onSubmit={submitCreate} className="workflow-form"><label>{t("users.email")}<input name="username" type="email" autoComplete="username" required /></label><label>{t("users.password")}<input name="password" type="password" autoComplete="new-password" required /></label><label>{t("users.firstName")}<input name="firstName" required /></label><label>{t("users.lastName")}<input name="lastName" required /></label><label>{t("users.role")}<select name="roleId" defaultValue="2"><option value="2">{t("roles.professor")}</option><option value="1">{t("roles.admin")}</option></select></label><div className="form-actions"><button className="button is-primary">{t("users.create")}</button><button type="button" className="button" onClick={() => setCreateOpen(false)}>{t("common.cancel")}</button></div></form></Modal>
    <Modal isOpen={Boolean(resetting)} onClose={() => setResetting(null)} title={interpolate(t("users.resetFor"), { email: resetting?.email })} closeLabel={t("common.close")}><form onSubmit={submitReset} className="compact-form"><label>{t("users.temporaryPassword")}<input name="temporaryPassword" type="password" required /></label><div className="form-actions"><button className="button is-primary">{t("users.saveTemporaryPassword")}</button><button type="button" className="button" onClick={() => setResetting(null)}>{t("common.cancel")}</button></div></form></Modal>
    <Modal isOpen={Boolean(deactivating)} onClose={() => setDeactivating(null)} title={t("users.confirmDeactivateTitle")} closeLabel={t("common.close")}><p>{interpolate(t("users.confirmDeactivate"), { email: deactivating?.email })}</p><div className="form-actions"><button className="button is-danger" onClick={deactivate}>{t("users.deactivate")}</button><button type="button" className="button" onClick={() => setDeactivating(null)}>{t("common.cancel")}</button></div></Modal>
  </section>;
}
