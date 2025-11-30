import { gql } from "@apollo/client";

export const CREATE_JOB = gql`
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      id
      name
      scheduleType
      status
    }
  }
`;

export const RUN_JOB_NOW = gql`
  mutation RunNow($id: ID!) {
    runJobNow(id: $id)
  }
`;

export const PAUSE_JOB = gql`
  mutation PauseJob($id: ID!) {
    pauseJob(id: $id) {
      id
      status
    }
  }
`;

export const RESUME_JOB = gql`
  mutation ResumeJob($id: ID!) {
    resumeJob(id: $id) {
      id
      status
    }
  }
`;

export const DELETE_JOB = gql`
  mutation DeleteJob($id: ID!) {
    deleteJob(id: $id)
  }
`;
