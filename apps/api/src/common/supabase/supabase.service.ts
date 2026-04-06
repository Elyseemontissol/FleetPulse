import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private adminClient: SupabaseClient;

  constructor(private config: ConfigService) {
    this.adminClient = createClient(
      this.config.getOrThrow('SUPABASE_URL'),
      this.config.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  /** Admin client — bypasses RLS. Use for server-side operations. */
  get admin(): SupabaseClient {
    return this.adminClient;
  }

  /** Create a client scoped to a specific user's JWT — respects RLS. */
  forUser(accessToken: string): SupabaseClient {
    return createClient(
      this.config.getOrThrow('SUPABASE_URL'),
      this.config.getOrThrow('SUPABASE_ANON_KEY'),
      {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
      },
    );
  }
}
