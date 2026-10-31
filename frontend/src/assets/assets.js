import workspace_img_default from "./workspace_img_default.png";
import profile_img_a from "./profile_img_a.svg";
import profile_img_o from "./profile_img_o.svg";
import profile_img_j from "./profile_img_j.svg";

export const assets = {
    workspace_img_default,
    profile_img_a,
    profile_img_o,
    profile_img_j,
}

export const dummyUsers = [
    {
        "id": "user_1",
        "name": "Alex Smith",
        "email": "alexsmith@example.com",
        "image": profile_img_a,
        "createdAt": "2025-10-06T11:04:03.485Z",
        "updatedAt": "2025-10-06T11:04:03.485Z"
    },
    {
        "id": "user_2",
        "name": "John Warrel",
        "email": "johnwarrel@example.com",
        "image": profile_img_j,
        "createdAt": "2025-10-09T13:20:24.360Z",
        "updatedAt": "2025-10-09T13:20:24.360Z"
    },
    {
        "id": "user_3",
        "name": "Oliver Watts",
        "email": "oliverwatts@example.com",
        "image": profile_img_o,
        "createdAt": "2025-09-01T04:31:22.043Z",
        "updatedAt": "2025-09-26T09:03:37.866Z"
    }
]

export const dummyWorkspaces = [
    {
        "id": "org_1",
        "name": "Corp Workspace",
        "slug": "corp-workspace",
        "description": null,
        "settings": {},
        "ownerId": "user_3",
        "createdAt": "2025-10-13T06:55:44.423Z",
        "image_url": workspace_img_default,
        "updatedAt": "2025-10-13T07:17:36.890Z",
        "members": [
            {
                "id": "a7422a50-7dfb-4e34-989c-881481250f0e",
                "userId": "user_1",
                "workspaceId": "org_1",
                "message": "",
                "role": "ADMIN",
                "user": dummyUsers[0],
            },
            {
                "id": "b325ed10-00d8-4e22-b94d-33a9994fd06b",
                "userId": "user_2",
                "workspaceId": "org_1",
                "message": "",
                "role": "ADMIN",
                "user": dummyUsers[1],
            },
            {
                "id": "0f786ac0-62f7-493f-a5a0-787fd7c9c8b3",
                "userId": "user_3",
                "workspaceId": "org_1",
                "message": "",
                "role": "ADMIN",
                "user": dummyUsers[2],
            }
        ],
        "projects": [
            {
                "id": "4d0f6ef3-e798-4d65-a864-00d9f8085c51",
                "name": "LaunchPad CRM",
                "description": "A next-gen CRM for startups to manage customer pipelines, analytics, and automation.",
                "priority": "HIGH",
                "status": "ACTIVE",
                "start_date": "2025-10-10T00:00:00.000Z",
                "end_date": "2026-02-28T00:00:00.000Z",
                "team_lead": "user_3",
                "workspaceId": "org_1",
                "progress": 65,
                "createdAt": "2025-10-13T08:01:35.491Z",
                "updatedAt": "2025-10-13T08:01:45.620Z",
                "tasks": [
                    {
                        "id": "24ca6d74-7d32-41db-a257-906a90bca8f4",
                        "projectId": "4d0f6ef3-e798-4d65-a864-00d9f8085c51",
                        "title": "Design Dashboard UI",
                        "description": "Create a modern, responsive CRM dashboard layout.",
                        "status": "IN_PROGRESS",
                        "type": "FEATURE",
                        "priority": "HIGH",
                        "assigneeId": "user_1",
                        "due_date": "2025-10-31T00:00:00.000Z",
                        "createdAt": "2025-10-13T08:04:04.084Z",
                        "updatedAt": "2025-10-13T08:04:04.084Z",
                        "assignee": dummyUsers[0],
                        "comments": []
                    },
                    {
                        "id": "9dbd5f04-5a29-4232-9e8c-a1d8e4c566df",
                        "projectId": "4d0f6ef3-e798-4d65-a864-00d9f8085c51",
                        "title": "Integrate Email API",
                        "description": "Set up SendGrid integration for email campaigns.",
                        "status": "TODO",
                        "type": "TASK",
                        "priority": "MEDIUM",
                        "assigneeId": "user_2",
                        "due_date": "2025-11-30T00:00:00.000Z",
                        "createdAt": "2025-10-13T08:10:31.922Z",
                        "updatedAt": "2025-10-13T08:10:31.922Z",
                        "assignee": dummyUsers[1],
                        "comments": []
                    },
                    {
                        "id": "0e6798ad-8a1d-4bca-b0cd-8199491dbf03",
                        "projectId": "4d0f6ef3-e798-4d65-a864-00d9f8085c51",
                        "title": "Fix Duplicate Contact Bug",
                        "description": "Duplicate records appear when importing CSV files.",
                        "status": "TODO",
                        "type": "BUG",
                        "priority": "HIGH",
                        "assigneeId": "user_1",
                        "due_date": "2025-12-05T00:00:00.000Z",
                        "createdAt": "2025-10-13T08:11:33.779Z",
                        "updatedAt": "2025-10-13T08:11:33.779Z",
                        "assignee": dummyUsers[0],
                        "comments": []
                    },
                    {
                        "id": "7989b4cc-1234-4816-a1d9-cc86cd09596a",
                        "projectId": "4d0f6ef3-e798-4d65-a864-00d9f8085c51",
                        "title": "Add Role-Based Access Control (RBAC)",
                        "description": "Define user roles and permissions for the dashboard.",
                        "status": "IN_PROGRESS",
                        "type": "IMPROVEMENT",
                        "priority": "MEDIUM",
                        "assigneeId": "user_2",
                        "due_date": "2025-12-20T00:00:00.000Z",
                        "createdAt": "2025-10-13T08:12:35.146Z",
                        "updatedAt": "2025-10-13T08:12:35.146Z",
                        "assignee": dummyUsers[1],
                        "comments": []
                    }
                ],
                "members": [
                    {
                        "id": "17dc3764-737f-4584-9b54-d1a3b401527d",
                        "userId": "user_1",
                        "projectId": "4d0f6ef3-e798-4d65-a864-00d9f8085c51",
                        "user": dummyUsers[0]
                    },
                    {
                        "id": "774b0f38-7fd7-431a-b3bd-63262f036ca9",
                        "userId": "user_2",
                        "projectId": "4d0f6ef3-e798-4d65-a864-00d9f8085c51",
                        "user": dummyUsers[1]
                    },
                    {
                        "id": "573354b2-6649-4c7e-b4cc-7c94c93df340",
                        "userId": "user_3",
                        "projectId": "4d0f6ef3-e798-4d65-a864-00d9f8085c51",
                        "user": dummyUsers[2]
                    }
                ]
            },
            {
                "id": "e5f0a667-e883-41c4-8c87-acb6494d6341",
                "name": "Brand Identity Overhaul",
                "description": "Rebranding client products with cohesive color palettes and typography systems.",
                "priority": "MEDIUM",
                "status": "PLANNING",
                "start_date": "2025-10-18T00:00:00.000Z",
                "end_date": "2026-03-10T00:00:00.000Z",
                "team_lead": "user_3",
                "workspaceId": "org_1",
                "progress": 25,
                "createdAt": "2025-10-13T08:15:27.895Z",
                "updatedAt": "2025-10-13T08:16:32.157Z",
                "tasks": [
                    {
                        "id": "a51bd102-6789-4e60-81ba-57768c63b7db",
                        "projectId": "e5f0a667-e883-41c4-8c87-acb6494d6341",
                        "title": "Create New Logo Concepts",
                        "description": "Sketch and finalize 3 logo concepts for client review.",
                        "status": "IN_PROGRESS",
                        "type": "FEATURE",
                        "priority": "MEDIUM",
                        "assigneeId": "user_2",
                        "due_date": "2025-10-31T00:00:00.000Z",
                        "createdAt": "2025-10-13T08:16:19.936Z",
                        "updatedAt": "2025-10-13T08:16:19.936Z",
                        "assignee": dummyUsers[1],
                        "comments": []
                    },
                    {
                        "id": "c7cafc09-5138-4918-9277-5ab94b520410",
                        "projectId": "e5f0a667-e883-41c4-8c87-acb6494d6341",
                        "title": "Update Typography System",
                        "description": "Introduce new font hierarchy with responsive scaling.",
                        "status": "TODO",
                        "type": "IMPROVEMENT",
                        "priority": "MEDIUM",
                        "assigneeId": "user_1",
                        "due_date": "2025-11-15T00:00:00.000Z",
                        "createdAt": "2025-10-13T08:17:36.730Z",
                        "updatedAt": "2025-10-13T08:17:36.730Z",
                        "assignee": dummyUsers[0],
                        "comments": []
                    },
                    {
                        "id": "53883b41-1912-460e-8501-43363ff3f5d4",
                        "projectId": "e5f0a667-e883-41c4-8c87-acb6494d6341",
                        "title": "Client Feedback Integration",
                        "description": "Implement client-requested adjustments to the brand guide.",
                        "status": "TODO",
                        "type": "TASK",
                        "priority": "LOW",
                        "assigneeId": "user_2",
                        "due_date": "2025-10-31T00:00:00.000Z",
                        "createdAt": "2025-10-13T08:18:16.611Z",
                        "updatedAt": "2025-10-13T08:18:16.611Z",
                        "assignee": dummyUsers[1],
                        "comments": []
                    }
                ],
                "members": [
                    {
                        "id": "32ad603e-c290-4f6e-860b-10212e1b080d",
                        "userId": "user_1",
                        "projectId": "e5f0a667-e883-41c4-8c87-acb6494d6341",
                        "user": dummyUsers[0],
                    },
                    {
                        "id": "10e8e546-ac59-474a-a3fc-768795810c65",
                        "userId": "user_2",
                        "projectId": "e5f0a667-e883-41c4-8c87-acb6494d6341",
                        "user": dummyUsers[1],
                    },
                    {
                        "id": "5a1f3c12-fcb2-40ef-91ee-dbd582219a8b",
                        "userId": "user_3",
                        "projectId": "e5f0a667-e883-41c4-8c87-acb6494d6341",
                        "user": dummyUsers[2],
                    }
                ]
            }
        ],
        "owner": dummyUsers[2],
    },
    {
        "id": "org_2",
        "name": "Cloud Ops Hub",
        "slug": "cloud-ops-hub",
        "description": null,
        "settings": {},
        "ownerId": "user_3",
        "createdAt": "2025-10-13T08:19:36.035Z",
        "image_url": workspace_img_default,
        "updatedAt": "2025-10-13T08:19:36.035Z",
        "members": [
            {
                "id": "f5d37afc-c287-4bd8-a607-b50d20837234",
                "userId": "user_3",
                "workspaceId": "org_2",
                "message": "",
                "role": "ADMIN",
                "user": dummyUsers[2],
            },
            {
                "id": "f5c04fe5-a0f5-4d34-bcf6-ea54dce1b546",
                "userId": "user_1",
                "workspaceId": "org_2",
                "message": "",
                "role": "ADMIN",
                "user": dummyUsers[0],
            },
            {
                "id": "9b29463a-e828-4d4e-9d64-8e57a3ad1a90",
                "userId": "user_2",
                "workspaceId": "org_2",
                "message": "",
                "role": "ADMIN",
                "user": dummyUsers[1],
            }
        ],
        "projects": [
            {
                "id": "c45e93ec-2f68-4f07-af4b-aa84f1bd407c",
                "name": "Kubernetes Migration",
                "description": "Migrate the monolithic app infrastructure to Kubernetes for scalability.",
                "priority": "HIGH",
                "status": "ACTIVE",
                "start_date": "2025-10-15T00:00:00.000Z",
                "end_date": "2026-01-20T00:00:00.000Z",
                "team_lead": "user_3",
                "workspaceId": "org_2",
                "progress": 0,
                "createdAt": "2025-10-13T09:04:30.225Z",
                "updatedAt": "2025-10-13T09:04:30.225Z",
                "tasks": [
                    {
                        "id": "fc8ac710-ad12-4508-b934-9d59dea01872",
                        "projectId": "c45e93ec-2f68-4f07-af4b-aa84f1bd407c",
                        "title": "Security Audit",
                        "description": "Run container vulnerability scans and review IAM roles.",
                        "status": "TODO",
                        "type": "OTHER",
                        "priority": "MEDIUM",
                        "assigneeId": "user_3",
                        "due_date": "2025-12-10T00:00:00.000Z",
                        "createdAt": "2025-10-13T09:05:59.062Z",
                        "updatedAt": "2025-10-13T09:05:59.062Z",
                        "assignee": dummyUsers[2],
                        "comments": []
                    },
                    {
                        "id": "1cd6f85d-889a-4a5b-901f-ed8fa221d62b",
                        "projectId": "c45e93ec-2f68-4f07-af4b-aa84f1bd407c",
                        "title": "Set Up EKS Cluster",
                        "description": "Provision EKS cluster on AWS and configure nodes.",
                        "status": "TODO",
                        "type": "TASK",
                        "priority": "HIGH",
                        "assigneeId": "user_1",
                        "due_date": "2025-12-15T00:00:00.000Z",
                        "createdAt": "2025-10-13T09:04:58.859Z",
                        "updatedAt": "2025-10-13T09:04:58.859Z",
                        "assignee": dummyUsers[0],
                        "comments": []
                    },
                    {
                        "id": "8125eeac-196d-4797-8b14-21260f46abcc",
                        "projectId": "c45e93ec-2f68-4f07-af4b-aa84f1bd407c",
                        "title": "Implement CI/CD with GitHub Actions",
                        "description": "Add build, test, and deploy steps using GitHub Actions.",
                        "status": "TODO",
                        "type": "TASK",
                        "priority": "MEDIUM",
                        "assigneeId": "user_2",
                        "due_date": "2025-10-31T00:00:00.000Z",
                        "createdAt": "2025-10-13T09:05:25.518Z",
                        "updatedAt": "2025-10-13T09:05:25.518Z",
                        "assignee": dummyUsers[1],
                        "comments": []
                    }
                ],
                "members": [
                    {
                        "id": "511552d5-eddd-4b12-a60d-fad0821682a7",
                        "userId": "user_3",
                        "projectId": "c45e93ec-2f68-4f07-af4b-aa84f1bd407c",
                        "user": dummyUsers[2],
                    },
                    {
                        "id": "79c364eb-eca5-4056-bea9-46c2f54efe4c",
                        "userId": "user_1",
                        "projectId": "c45e93ec-2f68-4f07-af4b-aa84f1bd407c",
                        "user": dummyUsers[0],
                    },
                    {
                        "id": "5fcbda36-d327-4615-bb38-d871a014fe52",
                        "userId": "user_2",
                        "projectId": "c45e93ec-2f68-4f07-af4b-aa84f1bd407c",
                        "user": dummyUsers[1],
                    }
                ]
            },
            {
                "id": "b190343f-a7b1-4a40-b483-ecc59835cba3",
                "name": "Project: Automated Regression Suite",
                "description": "Selenium + Playwright hybrid test framework for regression testing.",
                "priority": "MEDIUM",
                "status": "ACTIVE",
                "start_date": "2025-10-03T00:00:00.000Z",
                "end_date": "2025-10-15T00:00:00.000Z",
                "team_lead": "user_3",
                "workspaceId": "org_2",
                "progress": 0,
                "createdAt": "2025-10-13T09:08:30.202Z",
                "updatedAt": "2025-10-13T09:08:30.202Z",
                "tasks": [
                    {
                        "id": "8836edf0-b4d7-4eec-a170-960d715a0b7f",
                        "projectId": "b190343f-a7b1-4a40-b483-ecc59835cba3",
                        "title": "Migrate to Playwright 1.48",
                        "description": "Update scripts to use latest Playwright features.",
                        "status": "IN_PROGRESS",
                        "type": "IMPROVEMENT",
                        "priority": "HIGH",
                        "assigneeId": "user_1",
                        "due_date": "2025-10-31T00:00:00.000Z",
                        "createdAt": "2025-10-13T09:09:15.029Z",
                        "updatedAt": "2025-10-13T09:09:15.029Z",
                        "assignee": dummyUsers[0],
                        "comments": []
                    },
                    {
                        "id": "ce3dc378-f959-42f4-b12b-4c6cae6195c9",
                        "projectId": "b190343f-a7b1-4a40-b483-ecc59835cba3",
                        "title": "Parallel Test Execution",
                        "description": "Enable concurrent test runs across CI pipelines.",
                        "status": "TODO",
                        "type": "TASK",
                        "priority": "MEDIUM",
                        "assigneeId": "user_2",
                        "due_date": "2025-11-28T00:00:00.000Z",
                        "createdAt": "2025-10-13T09:09:55.827Z",
                        "updatedAt": "2025-10-13T09:09:55.827Z",
                        "assignee": dummyUsers[1],
                        "comments": []
                    },
                    {
                        "id": "e01fda50-8818-4635-bcb6-9cde5c140b3d",
                        "projectId": "b190343f-a7b1-4a40-b483-ecc59835cba3",
                        "title": "Visual Snapshot Comparison",
                        "description": "Implement screenshot diffing for UI regression detection.",
                        "status": "TODO",
                        "type": "FEATURE",
                        "priority": "LOW",
                        "assigneeId": "user_1",
                        "due_date": "2025-11-20T00:00:00.000Z",
                        "createdAt": "2025-10-13T09:10:27.049Z",
                        "updatedAt": "2025-10-13T09:10:27.049Z",
                        "assignee": dummyUsers[0],
                        "comments": []
                    }
                ],
                "members": [
                    {
                        "id": "1a0d5a66-c2ca-4294-9735-f3bd287500fa",
                        "userId": "user_3",
                        "projectId": "b190343f-a7b1-4a40-b483-ecc59835cba3",
                        "user": dummyUsers[2],
                    },
                    {
                        "id": "5ea89fe0-64b5-4737-a379-a9d89790ea3a",
                        "userId": "user_1",
                        "projectId": "b190343f-a7b1-4a40-b483-ecc59835cba3",
                        "user": dummyUsers[0],
                    },
                    {
                        "id": "320b617a-165e-42ec-8065-05da2d10b622",
                        "userId": "user_2",
                        "projectId": "b190343f-a7b1-4a40-b483-ecc59835cba3",
                        "user": dummyUsers[1],
                    }
                ]
            }
        ],
        "owner": dummyUsers[2],
    }
]