SET ROLE postgres;

-- 1. Create a helper function to check if the user is an admin
-- SECURITY DEFINER bypasses RLS, which breaks the infinite recursion loop
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create a helper function to check if the user is an author or admin
CREATE OR REPLACE FUNCTION public.is_author_or_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('author', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop the old recursive policies
DROP POLICY IF EXISTS "Admins have full access to users" ON public.users;
DROP POLICY IF EXISTS "Admins have full access to posts" ON public.posts;
DROP POLICY IF EXISTS "Admins have full access to comments" ON public.comments;
DROP POLICY IF EXISTS "Authors can create posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can delete own posts" ON public.posts;

-- 4. Re-create the policies using the new functions
-- USERS
CREATE POLICY "Admins have full access to users" ON public.users 
FOR ALL USING (is_admin());

-- POSTS
CREATE POLICY "Admins have full access to posts" ON public.posts 
FOR ALL USING (is_admin());

CREATE POLICY "Authors can create posts" ON public.posts 
FOR INSERT WITH CHECK (auth.uid() = author_id AND is_author_or_admin());

CREATE POLICY "Authors can update own posts" ON public.posts 
FOR UPDATE USING (auth.uid() = author_id AND is_author_or_admin());

CREATE POLICY "Authors can delete own posts" ON public.posts 
FOR DELETE USING (auth.uid() = author_id AND is_author_or_admin());

-- COMMENTS
CREATE POLICY "Admins have full access to comments" ON public.comments 
FOR ALL USING (is_admin());

-- 5. Refresh cache
NOTIFY pgrst, 'reload schema';
