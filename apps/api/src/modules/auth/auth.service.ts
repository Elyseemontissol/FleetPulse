import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.admin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    const { data: profile } = await this.supabase.admin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      user: data.user,
      profile,
      session: data.session,
    };
  }

  async getProfile(userId: string) {
    const { data, error } = await this.supabase.admin
      .from('profiles')
      .select('*, organizations(name, code)')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(userId: string, updates: Record<string, unknown>) {
    const { data, error } = await this.supabase.admin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
