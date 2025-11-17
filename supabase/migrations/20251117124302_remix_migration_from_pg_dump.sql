--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_crypto_config_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_crypto_config_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: crypto_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.crypto_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contract_address text DEFAULT ''::text NOT NULL,
    pump_fun_link text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: crypto_config crypto_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crypto_config
    ADD CONSTRAINT crypto_config_pkey PRIMARY KEY (id);


--
-- Name: crypto_config update_crypto_config_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_crypto_config_timestamp BEFORE UPDATE ON public.crypto_config FOR EACH ROW EXECUTE FUNCTION public.update_crypto_config_updated_at();


--
-- Name: crypto_config Anyone can read crypto config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read crypto config" ON public.crypto_config FOR SELECT USING (true);


--
-- Name: crypto_config Anyone can update crypto config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update crypto config" ON public.crypto_config FOR UPDATE USING (true);


--
-- Name: crypto_config; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.crypto_config ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


