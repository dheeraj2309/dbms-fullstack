import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import StudentForm from '@/components/forms/StudentForm';
import Link from 'next/link';

export default async function AdminStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await prisma.user.findUnique({
    where: { id: id},
    include: { formData: true },
  });

  if (!student) notFound();

  return (
    <div
      style={{
        maxWidth: 780,
        margin: '0 auto',
        padding: '40px 24px',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Back link */}
      <Link
        href="/admin/dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: '#8C7B6E',
          textDecoration: 'none',
          marginBottom: 28,
        }}
      >
        ← Back to all students
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#C4622D',
            margin: '0 0 8px',
          }}
        >
          Student profile
        </p>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 30,
            color: '#1C1410',
            margin: '0 0 6px',
          }}
        >
          {student.formData
            ? `${student.formData.firstName} ${student.formData.lastName ?? ''}`
            : student.email}
        </h1>
        <p style={{ fontSize: 14, color: '#8C7B6E', margin: 0 }}>
          {student.email} · Registered{' '}
          {new Date(student.createdAt).toLocaleDateString('en-IN', {
            dateStyle: 'medium',
          })}
        </p>
      </div>

      {/* Status pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        <span
          style={{
            background: student.isEmailVerified ? '#EAF3DE' : '#FAEEDA',
            color: student.isEmailVerified ? '#27500A' : '#633806',
            fontSize: 12,
            padding: '4px 12px',
            borderRadius: 99,
            fontWeight: 500,
          }}
        >
          {student.isEmailVerified ? 'Email verified' : 'Email not verified'}
        </span>
        <span
          style={{
            background: student.formData ? '#E6F1FB' : '#F1EFE8',
            color: student.formData ? '#0C447C' : '#5F5E5A',
            fontSize: 12,
            padding: '4px 12px',
            borderRadius: 99,
            fontWeight: 500,
          }}
        >
          {student.formData ? 'Form submitted' : 'Form not submitted'}
        </span>
      </div>

      {student.formData ? (
        <StudentForm
          existingData={student.formData as any}
          userId={student.id}
          isAdmin={true}
        />
      ) : (
        <div
          style={{
            background: 'white',
            border: '1px solid #E8DDD4',
            borderRadius: 16,
            padding: '48px 32px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 14, color: '#8C7B6E', margin: 0 }}>
            This student has not submitted their registration form yet.
          </p>
        </div>
      )}
    </div>
  );
}
