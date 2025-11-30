import { gql } from "@apollo/client";

export const GET_JOBS = gql`
  query GetJobs {
    jobs {
      id
      name
      scheduleType
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_JOB = gql`
  query GetJob($id: ID!) {
    job(id: $id) {
      id
      name
      scheduleType
      cronExpression
      intervalSeconds
      initialDelaySeconds
      payload
      status
      version
      createdAt
      updatedAt
    }
  }
`;

export const GET_EXECUTION_LOGS = gql`
  query Logs($jobId: ID!) {
    jobLogs(jobId: $jobId) {
      id
      jobId
      fireTime
      status
      errorMessage
      createdAt
    }
  }
`;
