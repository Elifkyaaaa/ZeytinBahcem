'use client';

import { Check, Minus, ShieldCheck, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { useActionState } from 'react';
import {
  invitePanelUser,
  updateUserRole,
  type AdminActionState,
} from '@/app/admin/actions';
import {
  AdminField,
  adminInput,
  EmptyState,
  Panel,
  Status,
  Table,
  Td,
  Th,
  Tr,
} from '@/components/admin/primitives';
import { FormAlert } from '@/components/auth/FormParts';
import { permissionLabels, permissionMatrix } from '@/lib/data/admin';
import { blurDataURL, cn, formatDate } from '@/lib/utils';
import type { UserRole } from '@/types/database';

export interface PanelUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  joined: string;
  isSelf: boolean;
}

const roles: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Yönetici' },
  { value: 'staff', label: 'Personel' },
  { value: 'customer', label: 'Müşteri' },
];

const roleTone = {
  admin: 'gold',
  staff: 'olive',
  customer: 'neutral',
} as const;

const matrixRoles = ['Yönetici', 'Editör', 'Sipariş Sorumlusu', 'Depo'] as const;

const initialState: AdminActionState = {};

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toLocaleUpperCase('tr-TR') || 'ZB'
  );
}

function PermissionCell({ level }: { level: string }) {
  const meta = permissionLabels[level];
  if (level === 'yok') {
    return (
      <span className="flex justify-center text-muted-foreground/35">
        <Minus className="size-4" strokeWidth={2.2} />
      </span>
    );
  }
  return (
    <span className={cn('flex items-center justify-center gap-1.5 text-xs font-medium', meta.tone)}>
      <Check className="size-3.5 shrink-0" strokeWidth={3} />
      {meta.label}
    </span>
  );
}

export function UserRoleTable({ users }: { users: PanelUser[] }) {
  const [roleState, roleAction] = useActionState(updateUserRole, initialState);
  const [inviteState, inviteAction] = useActionState(invitePanelUser, initialState);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
      <Panel
        title="Panel Kullanıcıları"
        description={`${users.length} kayıtlı kullanıcı · rol değişiklikleri anında uygulanır`}
        padded={false}
      >
        <div className="px-5 pt-5">
          <FormAlert error={roleState.error} success={roleState.success} />
        </div>

        {users.length === 0 ? (
          <EmptyState
            title="Henüz kullanıcı yok"
            description="Biri üye olduğunda burada listelenir."
          />
        ) : (
          <div className="p-5">
            <Table>
              <thead>
                <tr>
                  <Th>Kullanıcı</Th>
                  <Th>Üyelik</Th>
                  <Th>Mevcut rol</Th>
                  <Th align="right">Rol değiştir</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <span className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                            <Image
                              src={user.avatarUrl}
                              alt=""
                              fill
                              sizes="40px"
                              placeholder="blur"
                              blurDataURL={blurDataURL()}
                              className="object-cover"
                            />
                          </span>
                        ) : (
                          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-olive-700 text-xs font-bold text-cream-50 dark:bg-gold-500 dark:text-olive-950">
                            {initialsOf(user.name)}
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="truncate font-medium text-foreground">
                              {user.name}
                            </span>
                            {user.isSelf && (
                              <span className="shrink-0 rounded-full bg-foreground/8 px-1.5 py-0.5 text-[0.6rem] font-semibold text-muted-foreground">
                                siz
                              </span>
                            )}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td>
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {formatDate(user.joined)}
                      </span>
                    </Td>
                    <Td>
                      <Status tone={roleTone[user.role]}>
                        {roles.find((r) => r.value === user.role)?.label ?? user.role}
                      </Status>
                    </Td>
                    <Td align="right">
                      <form action={roleAction} className="flex items-center justify-end gap-2">
                        <input type="hidden" name="userId" value={user.id} />
                        <label className="sr-only" htmlFor={`role-${user.id}`}>
                          {user.name} için rol
                        </label>
                        <select
                          id={`role-${user.id}`}
                          name="role"
                          defaultValue={user.role}
                          className="h-9 rounded-lg border border-border bg-surface px-2.5 text-xs transition-colors hover:border-gold-500/45 focus:border-gold-500 focus:outline-none"
                        >
                          {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="h-9 shrink-0 rounded-lg bg-olive-700 px-3 text-xs font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 dark:bg-gold-500 dark:text-olive-950"
                        >
                          Kaydet
                        </button>
                      </form>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Panel>

      <Panel title="Kullanıcı Davet Et" description="Kayıtlıysa doğrudan yetkilendirilir">
        <form action={inviteAction} className="space-y-5">
          <FormAlert error={inviteState.error} success={inviteState.success} />

          <AdminField label="Ad Soyad" hint="Davet e-postasında görünür">
            <input name="fullName" className={adminInput} placeholder="Örn. Ayşe Yılmaz" />
          </AdminField>

          <AdminField label="E-posta">
            <input
              name="email"
              type="email"
              required
              className={adminInput}
              placeholder="ad@ornek.com"
            />
          </AdminField>

          <AdminField label="Rol" hint="Yetkiler aşağıdaki matriste tanımlı">
            <select name="role" defaultValue="staff" className={adminInput}>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </AdminField>

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-olive-700 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-[0.98] dark:bg-gold-500 dark:text-olive-950"
          >
            <UserPlus className="size-4" strokeWidth={2.2} />
            Davet Gönder
          </button>

          <div className="flex items-start gap-2.5 rounded-xl bg-surface-muted p-4">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-olive-600 dark:text-gold-400"
              strokeWidth={1.9}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Yönetici rolü tüm modüllere tam erişim verir. En az yetki ilkesini uygulayın.
              Kendi yöneticiliğinizi kaldıramaz ve sistemdeki son yöneticiyi
              yetkisizleştiremezsiniz — panelden kilitlenmeyi önlemek için.
            </p>
          </div>
        </form>
      </Panel>

      <Panel
        title="Yetki Matrisi"
        description="Hangi rolün hangi modülde ne yapabildiği"
        padded={false}
        className="xl:col-span-2"
      >
        <div className="p-5">
          <Table>
            <thead>
              <tr>
                <Th>Modül</Th>
                {matrixRoles.map((role) => (
                  <Th key={role} align="center">
                    {role}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionMatrix.map((row) => (
                <Tr key={row.module}>
                  <Td>
                    <span className="font-medium whitespace-nowrap text-foreground">
                      {row.module}
                    </span>
                  </Td>
                  {matrixRoles.map((role) => (
                    <Td key={role} align="center">
                      <PermissionCell level={row.roles[role]} />
                    </Td>
                  ))}
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border px-5 py-4 text-xs">
          {Object.entries(permissionLabels)
            .filter(([key]) => key !== 'yok')
            .map(([key, meta]) => (
              <span key={key} className={cn('flex items-center gap-1.5 font-medium', meta.tone)}>
                <Check className="size-3.5" strokeWidth={3} />
                {meta.label}
              </span>
            ))}
          <span className="flex items-center gap-1.5 text-muted-foreground/50">
            <Minus className="size-3.5" strokeWidth={2.4} />
            Erişim yok
          </span>
        </div>
      </Panel>
    </div>
  );
}
