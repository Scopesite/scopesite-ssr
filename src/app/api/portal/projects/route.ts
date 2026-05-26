/**
 * Portal Projects API
 *
 * GET /api/portal/projects?clientId= - List projects
 * POST /api/portal/projects - Create project (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getClientByClerkId,
  getClientById,
  getProjectsByClientId,
  createProject,
  logActivity,
} from '@/lib/portal-db';
import { isPortalAdmin } from '@/lib/portal-auth';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clientIdParam = searchParams.get('clientId');
    const admin = isPortalAdmin(userId);

    let clientId: string | null = null;

    if (admin && clientIdParam) {
      const target = await getClientById(clientIdParam);
      if (!target) {
        return NextResponse.json(
          { success: false, error: 'Client not found' },
          { status: 404 }
        );
      }
      clientId = target.id;
    } else {
      const client = await getClientByClerkId(userId);
      if (!client) {
        return NextResponse.json(
          { success: false, error: 'Client not found' },
          { status: 404 }
        );
      }
      clientId = client.id;
    }

    const projects = await getProjectsByClientId(clientId);

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isPortalAdmin(userId)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = (await request.json()) as {
      name?: string;
      description?: string | null;
      client_id?: string;
    };

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const clientId = typeof body.client_id === 'string' ? body.client_id : '';

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'client_id is required' },
        { status: 400 }
      );
    }

    const client = await getClientById(clientId);
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const description =
      typeof body.description === 'string' ? body.description.trim() || null : null;

    const project = await createProject({
      client_id: clientId,
      name,
      description,
      type: 'ongoing',
    });

    await logActivity({
      client_id: clientId,
      action_type: 'status_changed',
      description: `Project created: ${project.name}`,
      actor_type: 'admin',
      actor_name: 'Admin',
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
