import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
  Row,
  Column,
} from '@react-email/components';

interface ConfirmationEmailProps {
  name: string;
  course: string;
  branch?: string;
  year?: string;
  cgpa?: number;
  submittedAt: string;
}

export default function ConfirmationEmail({
  name,
  course,
  branch,
  year,
  cgpa,
  submittedAt,
}: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your registration has been submitted successfully</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto max-w-120 px-4 py-10">
            <Section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* Header */}
              <Section className="bg-[#085041] px-8 py-7">
                <Text className="m-0 mb-3 text-sm text-[#9FE1CB]">
                  Student Registration System
                </Text>
                <Heading className="m-0 mb-3 text-xl font-medium text-white">
                  Registration confirmed
                </Heading>
                <Text className="m-0 inline-block rounded-full bg-[#EAF3DE] px-3 py-1 text-xs text-[#27500A]">
                  Successfully submitted
                </Text>
              </Section>

              {/* Body */}
              <Section className="px-8 py-7">
                <Text className="m-0 mb-1 text-base text-gray-800">
                  Hi {name},
                </Text>
                <Text className="mt-1 mb-5 text-sm leading-relaxed text-gray-500">
                  Your registration form has been received. Here's a summary of
                  the details we have on file.
                </Text>

                {/* Details */}
                <Section className="mb-5 rounded-xl border border-gray-200 bg-gray-50 px-4">
                  {[
                    ['Full name', name],
                    ['Course', course],
                    ...(branch ? [['Branch', branch]] : []),
                    ...(year ? [['Year', year]] : []),
                    ...(cgpa ? [['CGPA', String(cgpa)]] : []),
                    ['Submitted', submittedAt],
                  ].map(([label, value], i, arr) => (
                    <Row
                      key={label}
                      className={
                        i < arr.length - 1 ? 'border-b border-gray-200' : ''
                      }
                    >
                      <Column className="w-32 py-3 text-sm text-gray-500">
                        {label}
                      </Column>
                      <Column className="py-3 text-right text-sm font-medium text-gray-800">
                        {value}
                      </Column>
                    </Row>
                  ))}
                </Section>

                {/* Info box */}
                <Section className="rounded-xl bg-[#E6F1FB] px-4 py-3">
                  <Text className="m-0 text-sm leading-relaxed text-[#0C447C]">
                    Need to make changes? Log back in anytime update your details.
                  </Text>
                </Section>
              </Section>

              {/* Footer */}
              <Section className="border-t border-gray-200 bg-gray-50 px-8 py-4">
                <Text className="m-0 text-center text-xs text-gray-400">
                  Student Registration System · Do not reply
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ConfirmationEmail.PreviewProps = {
  name: 'Rahul Sharma',
  course: 'B.Tech',
  branch: 'Computer Science',
  year: '3rd Year',
  cgpa: 8.7,
  submittedAt: '14 April 2026, 10:30 AM',
} satisfies ConfirmationEmailProps;
