--
-- PostgreSQL database dump
--

\restrict G3Of2VyRdD56rKuAngqKt2jYJyxELmqi2uVPE1KJCMpwafq5VW5ngIxqE7gYfcq

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-10-20 22:22:12

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16509)
-- Name: empresas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresas (
    id integer NOT NULL,
    nombre_empresa character varying(100) NOT NULL
);


ALTER TABLE public.empresas OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16514)
-- Name: empresas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empresas_id_seq OWNER TO postgres;

--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 220
-- Name: empresas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresas_id_seq OWNED BY public.empresas.id;


--
-- TOC entry 221 (class 1259 OID 16515)
-- Name: eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventos (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    descripcion text,
    fecha_inicio timestamp with time zone NOT NULL,
    fecha_fin timestamp with time zone,
    ubicacion character varying(255),
    capacidad integer DEFAULT 0,
    organizador_id integer NOT NULL,
    estado character varying(50) DEFAULT 'Borrador'::character varying NOT NULL
);


ALTER TABLE public.eventos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16527)
-- Name: eventos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eventos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eventos_id_seq OWNER TO postgres;

--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 222
-- Name: eventos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eventos_id_seq OWNED BY public.eventos.id;


--
-- TOC entry 223 (class 1259 OID 16528)
-- Name: perfiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfiles (
    usuario_id integer NOT NULL,
    nombre character varying(100),
    apellido character varying(100)
);


ALTER TABLE public.perfiles OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16532)
-- Name: registros_eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registros_eventos (
    id integer NOT NULL,
    evento_id integer NOT NULL,
    usuario_id integer NOT NULL,
    fecha_registro timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.registros_eventos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16539)
-- Name: registros_eventos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registros_eventos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registros_eventos_id_seq OWNER TO postgres;

--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 225
-- Name: registros_eventos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registros_eventos_id_seq OWNED BY public.registros_eventos.id;


--
-- TOC entry 226 (class 1259 OID 16540)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre_rol character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16545)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 227
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 228 (class 1259 OID 16546)
-- Name: sessiones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessiones (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.sessiones OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16554)
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16562)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol_id integer,
    correo_verificado boolean DEFAULT false,
    token_verificacion character varying(255),
    expiracion_token_verificacion timestamp without time zone,
    token_reset_password character varying(255),
    expiracion_token_reset timestamp without time zone,
    empresa_id integer
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16571)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 231
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4888 (class 2604 OID 16572)
-- Name: empresas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas ALTER COLUMN id SET DEFAULT nextval('public.empresas_id_seq'::regclass);


--
-- TOC entry 4889 (class 2604 OID 16573)
-- Name: eventos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos ALTER COLUMN id SET DEFAULT nextval('public.eventos_id_seq'::regclass);


--
-- TOC entry 4892 (class 2604 OID 16574)
-- Name: registros_eventos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_eventos ALTER COLUMN id SET DEFAULT nextval('public.registros_eventos_id_seq'::regclass);


--
-- TOC entry 4894 (class 2604 OID 16575)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4895 (class 2604 OID 16576)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 5074 (class 0 OID 16509)
-- Dependencies: 219
-- Data for Name: empresas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresas (id, nombre_empresa) FROM stdin;
2	empresa1
3	empresa2
4	empresa3
5	empresa4
6	empresa5
7	empresa6
8	en el futuro
9	eeee
10	empresa 1
11	miempresa1
12	empresaa
13	empresa 2
15	MiEmpresa
16	empresa
17	Empresa 23
18	empresa25
\.


--
-- TOC entry 5076 (class 0 OID 16515)
-- Dependencies: 221
-- Data for Name: eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos (id, titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, capacidad, organizador_id, estado) FROM stdin;
\.


--
-- TOC entry 5078 (class 0 OID 16528)
-- Dependencies: 223
-- Data for Name: perfiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfiles (usuario_id, nombre, apellido) FROM stdin;
1	Diana	fer
2	diana	fer
3	yo	Diana
4	Debai	xd
5	yo	otra
6	andres	nava
7	jose	nava
8	david	suarez
9	Diana 	Carolina
10	julio	julio
11	eeee	eeeee
12	Julio Cesar	Moran Villamizar
13	carlos	perez
14	martin	martinez
15	juan	rodriguez
16	ramiro	montoya
17	jose	jimenez
18	rodrigo	mendoza
19	julio	moran
20	Ana 	rosales
21	Julio	Leoni
22	prueba	prueba
23	pruebaa	prueba
24	Prueba	Prueba 2
25	pruebaa	priebaaa
\.


--
-- TOC entry 5079 (class 0 OID 16532)
-- Dependencies: 224
-- Data for Name: registros_eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registros_eventos (id, evento_id, usuario_id, fecha_registro) FROM stdin;
\.


--
-- TOC entry 5081 (class 0 OID 16540)
-- Dependencies: 226
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, nombre_rol) FROM stdin;
1	Administrador
5	Finanzas
6	Organizaci¢n
7	Usuario
\.


--
-- TOC entry 5083 (class 0 OID 16546)
-- Dependencies: 228
-- Data for Name: sessiones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessiones (sid, sess, expire) FROM stdin;
Q49QV6YTPd7PqSQEVXyBvQgnCjlKG4wM	{"cookie":{"originalMaxAge":604800000,"expires":"2025-10-13T03:55:52.281Z","secure":false,"httpOnly":true,"path":"/"},"usuario":{"id":1,"nombre":"Diana","apellido":"fer","email":"diana.final@eventos.com","rol_id":2,"nombre_rol":"Miembro de Equipo"}}	2025-10-12 20:56:37
\.


--
-- TOC entry 5084 (class 0 OID 16554)
-- Dependencies: 229
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_sessions (sid, sess, expire) FROM stdin;
\.


--
-- TOC entry 5085 (class 0 OID 16562)
-- Dependencies: 230
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, email, password_hash, rol_id, correo_verificado, token_verificacion, expiracion_token_verificacion, token_reset_password, expiracion_token_reset, empresa_id) FROM stdin;
21	usuario@ejemplo.com	$2b$10$KDs5Z7UCZcElsd9OPRnjKeilBJAEhm2AGtNvsil/maNF7V2F0O1dK	7	t	\N	\N	\N	\N	15
19	moran@test.com	$2b$10$RucdhWSSGCdBvtwpsT8js.18rZCvRyc3KXbdbyAgXFKHkGpeFjORm	7	t	\N	\N	\N	\N	13
1	diana.final@eventos.com	$2b$10$XplAnOJe3pWriIuPoT1dy.wfPHwPuXROPycg367aU9l2N7FkNXF7G	7	t	fe904eefc2dd3249854e5e9c22bf78f498c142ea00d52badd266194ea2d34e6d	2025-10-06 00:52:51.135	\N	\N	\N
2	hola@hola.com	$2b$10$Z1zl2M3j2Jem34zZ9HlOsuWz8zeTQdK0AF5lTzpOON2YRgjUf.jCu	7	t	\N	\N	\N	\N	\N
4	hola2@hola.com	$2b$10$MRYGeXj0MXrLGJqdi6JjM.nKx7gHJbAaoK1lopUd40ctTDrOrhMpW	7	t	\N	\N	\N	\N	3
5	hola3@hola.com	$2b$10$TaNraDQxJH3ZEbfCKYpD..N63bew1uT1rD89RcVyMMo/dKVxX7GL6	7	t	\N	\N	\N	\N	4
6	hola4@hola.com	$2b$10$qIbEi45ia1MEhLFyJXOFE.RV7Prb/dKXJrRKYnPgt1ZcHFM1Fku16	7	t	\N	\N	\N	\N	5
7	hola5@hola.com	$2b$10$ABP25mccrLFB2bhHzN7xoe93.UNyYtND3S/a3TVlSgoKpXSaxk4VG	7	t	\N	\N	\N	\N	6
3	hola1@hola.com	$2b$10$269WckioUEiFy3j9A5XENenVaUbe7Nx12TgQjiXnOr8KNfIJJURS6	7	t	\N	\N	\N	\N	2
8	hola6@hola.com	$2b$10$ZavdjEJLzwozP01S368OauTIFr8fuKbRiivT6dux1eGG5mtMfHLFu	7	t	\N	\N	\N	\N	7
9	diana1@gmail.com	$2b$10$QhhhFi.rwnqwZViGD09G4eijzo3yaHx0CargN5Eu8/aQAl6EaMuE2	7	t	\N	\N	\N	\N	8
10	julio2@gmail.com	$2b$10$Qj.DgWjO.GA6g34YKAY6yOiwGp2K87eaLBarYwaFbB2WJnNOzPnDO	7	f	806f5c08a37a8a2da344157dc46ddd38d4f4f2dcd4caf1dbc24103dbfc130a87	2025-10-10 15:09:42.739	\N	\N	3
11	anavillamizar223@gmail.com	$2b$10$e1EPf.4oJA/gmraNfNVG6evpjLxeYOro/Vj8DgFTxKQOkMwfJATX2	7	f	2e8f551ba9fcb6d3b614deb71788343f647c2e77b2fb7807fda7f2c15f1c9b43	2025-10-10 15:11:20.141	\N	\N	9
12	juliocmoran2801@gmail.com	$2b$10$mw5zTl8FjhSNEFKC5kyxTOf5oZYBfpnFm0E4bN9OYIBOvwN7zYuzi	7	f	930be3e26658390b37884db19e9304c3025aa43f4a23afdb4538d02ac11fe626	2025-10-10 15:44:04.882	\N	\N	10
13	carlos@test.com	$2b$10$W9VyXSXzazbStZfrfwAmSe1pcQ.3FxnKrm/b7ZcQMQDCc.cE97DzC	7	f	2057039d541bb453ba53339f2efcabd2847227d687dfbf885258bb5743d721fa	2025-10-10 23:05:47.028	\N	\N	11
14	martinez@test.com	$2b$10$KWTzRWjwAr4Z7wuqd1gnBufWfq/alPL.lvR.7634cgln9S6cQpoum	7	f	555ee86e558d49560d2e9b551a56cd5c25b1b4db5f9cfd42dbbf8ba3bd045ca4	2025-10-10 23:23:37.614	\N	\N	10
15	juan@test.com	$2b$10$hr30itBK52dcEnBStqnj..iIjx4crr1TNrtDiEStL44GYwJLg1o/i	7	f	77b75fb35f71ac27339289263aafdb6f6347138f28394eae0f071ff6922a3403	2025-10-10 23:37:21.027	\N	\N	10
16	montoya@test.com	$2b$10$ApJrhO6sbAAF0kxU5/bkie9p0MYH0tmRQyD0delXf3XG3MAwl3WOG	7	f	424f9ab5128892fcfe2ed7ad9d6791d70f47d31d58d519688e2f4c13b3754eaf	2025-10-10 23:56:08.265	\N	\N	3
17	jimenez@test.com	$2b$10$HXUHZq66GTe5M1tOd7UVv.pOaQ59iUaNUC1so2kEGUGL85MftzObK	7	t	\N	\N	\N	\N	12
18	mendoza@test.com	$2b$10$dBFVpoW6kzn0EWLRL9coz.q6LhJnKkk1MIJa4N5nVi4v2ii4dlzY2	7	t	\N	\N	\N	\N	10
20	rosales@test.com	$2b$10$IP8.wnRR8vfUshFI/FMxHeh.VwWLRC5eF3I6A2oxVE/fvYO88E76q	7	t	\N	\N	\N	\N	2
22	empresa@test.com	$2b$10$Hj.vVej8f.yqp0azl0ghWepFgOLaSoZYP9JLgDltwowzSpn/GdbzS	7	t	\N	\N	\N	\N	16
23	prueba2@test.com	$2b$10$v2CyG5OIY86z3A5rBIZnoegwz4r3nmBXyQXRCdQoltyX7O0SKiZyC	7	t	\N	\N	\N	\N	3
24	Prueba10@test.com	$2b$10$Z/U3FnOmGLZyguE3my9kBuKGzCPyDAld9aLM1ju8inM7OeRZxPXse	7	t	\N	\N	\N	\N	17
25	prueba25@test.com	$2b$10$EG43ERVoRcWd2b3/qUsseuev09baVMquFP5yGF.NHNDjp64WEQcp6	1	t	\N	\N	\N	\N	18
\.


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 220
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresas_id_seq', 18, true);


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 222
-- Name: eventos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_id_seq', 1, false);


--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 225
-- Name: registros_eventos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registros_eventos_id_seq', 1, false);


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 227
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 7, true);


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 231
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 25, true);


--
-- TOC entry 4898 (class 2606 OID 16578)
-- Name: empresas empresas_nombre_empresa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_nombre_empresa_key UNIQUE (nombre_empresa);


--
-- TOC entry 4900 (class 2606 OID 16580)
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id);


--
-- TOC entry 4902 (class 2606 OID 16582)
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id);


--
-- TOC entry 4904 (class 2606 OID 16584)
-- Name: perfiles perfiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT perfiles_pkey PRIMARY KEY (usuario_id);


--
-- TOC entry 4906 (class 2606 OID 16586)
-- Name: registros_eventos registros_eventos_evento_id_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_eventos
    ADD CONSTRAINT registros_eventos_evento_id_usuario_id_key UNIQUE (evento_id, usuario_id);


--
-- TOC entry 4908 (class 2606 OID 16588)
-- Name: registros_eventos registros_eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_eventos
    ADD CONSTRAINT registros_eventos_pkey PRIMARY KEY (id);


--
-- TOC entry 4910 (class 2606 OID 16590)
-- Name: roles roles_nombre_rol_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_rol_key UNIQUE (nombre_rol);


--
-- TOC entry 4912 (class 2606 OID 16592)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4915 (class 2606 OID 16594)
-- Name: sessiones sessiones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessiones
    ADD CONSTRAINT sessiones_pkey PRIMARY KEY (sid);


--
-- TOC entry 4918 (class 2606 OID 16596)
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (sid);


--
-- TOC entry 4920 (class 2606 OID 16598)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4922 (class 2606 OID 16600)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4916 (class 1259 OID 16601)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.user_sessions USING btree (expire);


--
-- TOC entry 4913 (class 1259 OID 16602)
-- Name: idx_sessiones_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessiones_expire ON public.sessiones USING btree (expire);


--
-- TOC entry 4923 (class 2606 OID 16603)
-- Name: perfiles perfiles_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT perfiles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4924 (class 2606 OID 16608)
-- Name: registros_eventos registros_eventos_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_eventos
    ADD CONSTRAINT registros_eventos_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id);


--
-- TOC entry 4925 (class 2606 OID 16613)
-- Name: usuarios usuarios_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 4926 (class 2606 OID 16618)
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id);


-- Completed on 2025-10-20 22:22:12

--
-- PostgreSQL database dump complete
--

\unrestrict G3Of2VyRdD56rKuAngqKt2jYJyxELmqi2uVPE1KJCMpwafq5VW5ngIxqE7gYfcq

