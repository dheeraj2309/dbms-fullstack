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

interface OtpEmailProps {
  otp: string;
  name: string;
}

export default function OtpEmail({ otp, name }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP is {otp} — valid for 10 minutes</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto max-w-120 px-4 py-10">
            <Section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* Header */}
              <Section className="bg-[#0C447C] px-8 py-7">
                <Row>
                  <Column>
                    <Text className="m-0 mb-3 text-sm text-[#B5D4F4]">
                      Student Registration System
                    </Text>
                    <Heading className="m-0 text-xl font-medium text-white">
                      Verify your email address
                    </Heading>
                  </Column>
                </Row>
              </Section>

              {/* Body */}
              <Section className="px-8 py-7">
                <Text className="mb-4 inline-block rounded-full bg-[#EAF3DE] px-3 py-1 text-xs text-[#27500A]">
                  One-time password
                </Text>

                <Text className="m-0 mb-1 text-base text-gray-800">
                  Hi {name},
                </Text>
                <Text className="mt-1 mb-5 text-sm leading-relaxed text-gray-500">
                  Use the code below to verify your email. It expires in{' '}
                  <span className="font-medium text-[#0C447C]">10 minutes</span>
                  .
                </Text>

                {/* OTP Box */}
                <Section className="mb-5 rounded-xl border border-[#85B7EB] bg-[#E6F1FB] px-6 py-5 text-center">
                  <Text className="m-0 mb-2 text-xs tracking-widest text-[#378ADD] uppercase">
                    Your OTP
                  </Text>
                  <Text className="m-0 font-mono text-4xl font-medium tracking-[12px] text-[#0C447C]">
                    {otp}
                  </Text>
                  <Text className="m-0 mt-2 text-xs text-[#378ADD]">
                    Valid for 10 minutes
                  </Text>
                </Section>

                <Text className="m-0 text-xs leading-relaxed text-gray-400">
                  Never share this code with anyone. We will never ask for your
                  OTP over phone or chat.
                </Text>

                <Hr className="my-5 border-gray-200" />

                <Text className="m-0 text-xs text-gray-400">
                  Didn't request this? You can safely ignore this email.
                </Text>
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

OtpEmail.PreviewProps = {
  otp: '482910',
  name: 'Rahul',
} satisfies OtpEmailProps;
