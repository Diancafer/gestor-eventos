--
-- PostgreSQL database dump
--

\restrict MHWSu0t3xWmeoqayOQIafI6N67ZopWuYeEA0eSg4gVFoMiEHwF59azEccbZTNJX

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-14 00:07:47

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
-- TOC entry 252 (class 1255 OID 16984)
-- Name: tiene_permiso(integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.tiene_permiso(p_rol integer, p_llave text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  resultado BOOLEAN;
BEGIN
  SELECT p.permitido
  INTO resultado
  FROM permisos p
  JOIN tx t ON p.transaccion_id = t.id
  WHERE p.rol_id = p_rol AND t.llave = p_llave;

  RETURN COALESCE(resultado, FALSE);
END;
$$;


ALTER FUNCTION public.tiene_permiso(p_rol integer, p_llave text) OWNER TO postgres;

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
-- TOC entry 5232 (class 0 OID 0)
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
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 222
-- Name: eventos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eventos_id_seq OWNED BY public.eventos.id;


--
-- TOC entry 242 (class 1259 OID 16862)
-- Name: gastos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gastos (
    id integer NOT NULL,
    usuario_id integer,
    descripcion text NOT NULL,
    monto numeric(12,2) NOT NULL,
    fecha timestamp without time zone DEFAULT now(),
    evento_id integer
);


ALTER TABLE public.gastos OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16861)
-- Name: gastos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gastos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gastos_id_seq OWNER TO postgres;

--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 241
-- Name: gastos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gastos_id_seq OWNED BY public.gastos.id;


--
-- TOC entry 233 (class 1259 OID 16682)
-- Name: metodos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metodos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    objeto_id integer
);


ALTER TABLE public.metodos OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16681)
-- Name: metodos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.metodos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.metodos_id_seq OWNER TO postgres;

--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 232
-- Name: metodos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metodos_id_seq OWNED BY public.metodos.id;


--
-- TOC entry 248 (class 1259 OID 16927)
-- Name: objetos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.objetos (
    id integer NOT NULL,
    nombre text NOT NULL,
    subsistema_id integer
);


ALTER TABLE public.objetos OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16926)
-- Name: objetos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.objetos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.objetos_id_seq OWNER TO postgres;

--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 247
-- Name: objetos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.objetos_id_seq OWNED BY public.objetos.id;


--
-- TOC entry 240 (class 1259 OID 16839)
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    monto numeric(12,2) NOT NULL,
    referencia character varying(100) NOT NULL,
    fecha_pago timestamp without time zone DEFAULT now(),
    evento_id integer,
    estado character varying(20) DEFAULT 'procesado'::character varying
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16838)
-- Name: pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_id_seq OWNER TO postgres;

--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 239
-- Name: pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_id_seq OWNED BY public.pagos.id;


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
-- TOC entry 235 (class 1259 OID 16695)
-- Name: permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permisos (
    id integer NOT NULL,
    rol_id integer NOT NULL,
    permitido boolean DEFAULT true,
    transaccion_id integer
);


ALTER TABLE public.permisos OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16694)
-- Name: permisos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permisos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permisos_id_seq OWNER TO postgres;

--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 234
-- Name: permisos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permisos_id_seq OWNED BY public.permisos.id;


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
-- TOC entry 5239 (class 0 OID 0)
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
-- TOC entry 5240 (class 0 OID 0)
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
-- TOC entry 246 (class 1259 OID 16914)
-- Name: subsistemas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subsistemas (
    id integer NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public.subsistemas OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16913)
-- Name: subsistemas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subsistemas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subsistemas_id_seq OWNER TO postgres;

--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 245
-- Name: subsistemas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subsistemas_id_seq OWNED BY public.subsistemas.id;


--
-- TOC entry 244 (class 1259 OID 16885)
-- Name: tx; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx (
    id integer CONSTRAINT tx_id_not_null1 NOT NULL,
    subsistema text NOT NULL,
    metodo text NOT NULL,
    objeto text NOT NULL,
    llave text GENERATED ALWAYS AS (((((subsistema || '.'::text) || metodo) || '.'::text) || objeto)) STORED,
    subsistema_id integer,
    metodo_id integer,
    objeto_id integer
);


ALTER TABLE public.tx OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16778)
-- Name: tx_ejecuciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_ejecuciones (
    id integer CONSTRAINT tx_id_not_null NOT NULL,
    usuario_id integer CONSTRAINT tx_usuario_id_not_null NOT NULL,
    metodo_id integer CONSTRAINT tx_metodo_id_not_null NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(50) DEFAULT 'pendiente'::character varying,
    detalle text,
    tx_id integer,
    llave text
);


ALTER TABLE public.tx_ejecuciones OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16777)
-- Name: tx_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tx_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tx_id_seq OWNER TO postgres;

--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 236
-- Name: tx_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tx_id_seq OWNED BY public.tx_ejecuciones.id;


--
-- TOC entry 243 (class 1259 OID 16884)
-- Name: tx_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tx_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tx_id_seq1 OWNER TO postgres;

--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 243
-- Name: tx_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tx_id_seq1 OWNED BY public.tx.id;


--
-- TOC entry 251 (class 1259 OID 16985)
-- Name: tx_log; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.tx_log AS
 SELECT id,
    usuario_id,
    metodo_id,
    fecha,
    estado,
    detalle,
    tx_id
   FROM public.tx_ejecuciones;


ALTER VIEW public.tx_log OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16801)
-- Name: tx_metodos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_metodos (
    tx_id integer NOT NULL,
    metodo_id integer NOT NULL
);


ALTER TABLE public.tx_metodos OWNER TO postgres;

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
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 231
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 249 (class 1259 OID 16947)
-- Name: v_permisos_por_rol; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_permisos_por_rol AS
 SELECT r.nombre_rol,
    t.llave,
    p.permitido
   FROM ((public.permisos p
     JOIN public.roles r ON ((p.rol_id = r.id)))
     JOIN public.tx t ON ((p.transaccion_id = t.id)))
  ORDER BY r.nombre_rol, t.llave;


ALTER VIEW public.v_permisos_por_rol OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 16974)
-- Name: vw_permisos_detalle; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_permisos_detalle AS
 SELECT p.rol_id,
    r.nombre_rol,
    t.llave,
    s.nombre AS subsistema,
    m.nombre AS metodo,
    o.nombre AS objeto,
    p.permitido
   FROM (((((public.permisos p
     JOIN public.tx t ON ((p.transaccion_id = t.id)))
     JOIN public.subsistemas s ON ((t.subsistema_id = s.id)))
     JOIN public.metodos m ON ((t.metodo_id = m.id)))
     JOIN public.objetos o ON ((t.objeto_id = o.id)))
     LEFT JOIN public.roles r ON ((p.rol_id = r.id)));


ALTER VIEW public.vw_permisos_detalle OWNER TO postgres;

--
-- TOC entry 4945 (class 2604 OID 16572)
-- Name: empresas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas ALTER COLUMN id SET DEFAULT nextval('public.empresas_id_seq'::regclass);


--
-- TOC entry 4946 (class 2604 OID 16573)
-- Name: eventos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos ALTER COLUMN id SET DEFAULT nextval('public.eventos_id_seq'::regclass);


--
-- TOC entry 4963 (class 2604 OID 16865)
-- Name: gastos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gastos ALTER COLUMN id SET DEFAULT nextval('public.gastos_id_seq'::regclass);


--
-- TOC entry 4954 (class 2604 OID 16685)
-- Name: metodos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodos ALTER COLUMN id SET DEFAULT nextval('public.metodos_id_seq'::regclass);


--
-- TOC entry 4968 (class 2604 OID 16930)
-- Name: objetos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objetos ALTER COLUMN id SET DEFAULT nextval('public.objetos_id_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 16842)
-- Name: pagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);


--
-- TOC entry 4955 (class 2604 OID 16698)
-- Name: permisos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos ALTER COLUMN id SET DEFAULT nextval('public.permisos_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 16574)
-- Name: registros_eventos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_eventos ALTER COLUMN id SET DEFAULT nextval('public.registros_eventos_id_seq'::regclass);


--
-- TOC entry 4951 (class 2604 OID 16575)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4967 (class 2604 OID 16917)
-- Name: subsistemas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subsistemas ALTER COLUMN id SET DEFAULT nextval('public.subsistemas_id_seq'::regclass);


--
-- TOC entry 4965 (class 2604 OID 16888)
-- Name: tx id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx ALTER COLUMN id SET DEFAULT nextval('public.tx_id_seq1'::regclass);


--
-- TOC entry 4957 (class 2604 OID 16781)
-- Name: tx_ejecuciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_ejecuciones ALTER COLUMN id SET DEFAULT nextval('public.tx_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 16576)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 5197 (class 0 OID 16509)
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
19	admin
\.


--
-- TOC entry 5199 (class 0 OID 16515)
-- Dependencies: 221
-- Data for Name: eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos (id, titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, capacidad, organizador_id, estado) FROM stdin;
1	Foro Ambiental	Debate sobre gestión de residuos	2025-11-10 09:00:00+00	2025-11-10 12:00:00+00	Auditorio Central	100	29	activo
2	Foro Ambiental	Debate sobre gestión de residuos	2025-11-10 09:00:00+00	2025-11-10 12:00:00+00	Auditorio Central	100	29	activo
3	Feria	Concierto	2025-11-10 09:00:00+00	2025-11-10 12:00:00+00	Hotel tibisay	300	29	activo
4	Feria	Exposicion	2025-11-10 10:00:00+00	2025-11-10 12:00:00+00	Hotel tibisay	300	29	activo
\.


--
-- TOC entry 5220 (class 0 OID 16862)
-- Dependencies: 242
-- Data for Name: gastos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gastos (id, usuario_id, descripcion, monto, fecha, evento_id) FROM stdin;
\.


--
-- TOC entry 5211 (class 0 OID 16682)
-- Dependencies: 233
-- Data for Name: metodos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.metodos (id, nombre, descripcion, objeto_id) FROM stdin;
1	crear_evento	Permite al organizador crear eventos	\N
2	pagar	Permite al usuario realizar pagos	\N
3	visualizar_eventos	Permite ver eventos disponibles	\N
4	visualizar_pagos	Permite ver pagos realizados	\N
5	reservar_lugar	Permite reservar lugar en un evento	\N
6	visualizar_reportes	Permite ver reportes financieros y de asistencia	\N
7	asignar_roles	Permite asignar roles al personal	\N
8	contratar_personal	Permite contratar personal para eventos	\N
9	registrar_gastos	Permite registrar gastos del evento	\N
10	registrar_asistencia	Permite registrar asistencia de personas	\N
\.


--
-- TOC entry 5226 (class 0 OID 16927)
-- Dependencies: 248
-- Data for Name: objetos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.objetos (id, nombre, subsistema_id) FROM stdin;
1	evento	\N
2	pago	\N
3	reporte	\N
4	usuario	\N
5	gasto	\N
\.


--
-- TOC entry 5218 (class 0 OID 16839)
-- Dependencies: 240
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id, usuario_id, monto, referencia, fecha_pago, evento_id, estado) FROM stdin;
1	28	100.00	ABC123	2025-11-14 02:38:03.33844	\N	procesado
2	28	100.00	ABC123	2025-11-14 02:40:52.548871	\N	procesado
3	28	100.00	ABC123	2025-11-14 02:55:06.172439	\N	procesado
4	28	100.00	ABC123	2025-11-14 02:57:55.712147	\N	procesado
5	28	100.00	ABC123	2025-11-14 03:03:06.134337	\N	procesado
6	28	100.00	ABC123	2025-11-14 03:08:55.140146	\N	procesado
7	28	300.00	ABC123	2025-11-14 03:57:57.23769	\N	procesado
\.


--
-- TOC entry 5201 (class 0 OID 16528)
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
26	jose	jose
27	prubaaa	krjew
28	miguel	hernandez
29	admin	admin
\.


--
-- TOC entry 5213 (class 0 OID 16695)
-- Dependencies: 235
-- Data for Name: permisos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permisos (id, rol_id, permitido, transaccion_id) FROM stdin;
1	1	t	1
14	6	t	1
21	1	t	10
22	1	t	2
23	1	t	5
24	1	t	8
25	1	t	6
26	1	t	4
27	1	t	3
28	1	t	9
29	1	t	7
30	5	t	6
31	5	t	4
32	5	t	3
33	5	t	9
34	6	t	10
35	6	t	6
36	6	t	3
37	7	t	2
38	7	t	5
39	7	t	3
\.


--
-- TOC entry 5202 (class 0 OID 16532)
-- Dependencies: 224
-- Data for Name: registros_eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registros_eventos (id, evento_id, usuario_id, fecha_registro) FROM stdin;
\.


--
-- TOC entry 5204 (class 0 OID 16540)
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
-- TOC entry 5206 (class 0 OID 16546)
-- Dependencies: 228
-- Data for Name: sessiones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessiones (sid, sess, expire) FROM stdin;
Q49QV6YTPd7PqSQEVXyBvQgnCjlKG4wM	{"cookie":{"originalMaxAge":604800000,"expires":"2025-10-13T03:55:52.281Z","secure":false,"httpOnly":true,"path":"/"},"usuario":{"id":1,"nombre":"Diana","apellido":"fer","email":"diana.final@eventos.com","rol_id":2,"nombre_rol":"Miembro de Equipo"}}	2025-10-12 20:56:37
\.


--
-- TOC entry 5224 (class 0 OID 16914)
-- Dependencies: 246
-- Data for Name: subsistemas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subsistemas (id, nombre) FROM stdin;
1	eventos
2	finanzas
3	usuarios
\.


--
-- TOC entry 5222 (class 0 OID 16885)
-- Dependencies: 244
-- Data for Name: tx; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx (id, subsistema, metodo, objeto, subsistema_id, metodo_id, objeto_id) FROM stdin;
1	eventos	crear_evento	evento	1	1	1
2	finanzas	pagar	evento	2	2	1
3	eventos	visualizar_eventos	evento	1	3	1
4	finanzas	visualizar_pagos	pago	2	4	2
5	eventos	reservar_lugar	evento	1	5	1
6	finanzas	visualizar_reportes	reporte	2	6	3
7	usuarios	asignar_roles	usuario	3	7	4
8	usuarios	contratar_personal	usuario	3	8	4
9	finanzas	registrar_gastos	gasto	2	9	5
10	eventos	registrar_asistencia	evento	1	10	1
\.


--
-- TOC entry 5215 (class 0 OID 16778)
-- Dependencies: 237
-- Data for Name: tx_ejecuciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_ejecuciones (id, usuario_id, metodo_id, fecha, estado, detalle, tx_id, llave) FROM stdin;
1	29	1	2025-11-07 02:52:36.687689	exitoso	\N	\N	\N
2	29	1	2025-11-07 03:58:49.109793	exitoso	\N	\N	\N
3	29	1	2025-11-07 04:00:42.408234	exitoso	\N	\N	\N
4	29	1	2025-11-07 04:52:15.156991	exitoso	\N	\N	\N
5	28	1	2025-11-07 04:56:46.95771	denegado	\N	\N	\N
6	28	3	2025-11-07 06:04:52.029158	exitoso	\N	\N	\N
9	28	2	2025-11-14 03:03:06.137398	exitoso	Ejecutado correctamente	2	finanzas.pagar.evento
10	28	2	2025-11-14 03:08:55.143595	exitoso	Ejecutado correctamente	2	finanzas.pagar.evento
11	28	3	2025-11-14 03:09:16.122724	exitoso	Ejecutado correctamente	3	eventos.visualizar_eventos.evento
12	28	7	2025-11-14 03:21:58.437015	denegado	Permiso denegado	7	usuarios.asignar_roles.usuario
13	28	7	2025-11-14 03:57:31.913089	denegado	Permiso denegado	7	usuarios.asignar_roles.usuario
14	28	2	2025-11-14 03:57:57.295202	exitoso	Ejecutado correctamente	2	finanzas.pagar.evento
15	28	3	2025-11-14 03:59:25.938991	exitoso	Ejecutado correctamente	3	eventos.visualizar_eventos.evento
\.


--
-- TOC entry 5216 (class 0 OID 16801)
-- Dependencies: 238
-- Data for Name: tx_metodos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_metodos (tx_id, metodo_id) FROM stdin;
1	1
2	2
3	3
4	4
5	5
6	6
7	7
8	8
9	9
10	10
\.


--
-- TOC entry 5207 (class 0 OID 16554)
-- Dependencies: 229
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_sessions (sid, sess, expire) FROM stdin;
\.


--
-- TOC entry 5208 (class 0 OID 16562)
-- Dependencies: 230
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, email, password_hash, rol_id, correo_verificado, token_verificacion, expiracion_token_verificacion, token_reset_password, expiracion_token_reset, empresa_id) FROM stdin;
21	usuario@ejemplo.com	$2b$10$KDs5Z7UCZcElsd9OPRnjKeilBJAEhm2AGtNvsil/maNF7V2F0O1dK	7	t	\N	\N	\N	\N	15
29	admin@test.com	$2b$10$.Cm.Cbn1tWfNkpKtFsF3qO1orBVf49rtR/tX/o.ryzygTo/SwgeKe	1	t	\N	\N	\N	\N	19
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
27	prueba12@test.com	$2b$10$s5Z2XiKoq319qOTaYauC5.PkVrxrH3CDN/XLPuHgVIUy5kjMADy6u	7	t	\N	\N	\N	\N	3
26	prueba60@test.com	$2b$10$WAhFgZ6W8FRv3NG/A/URo.ea4j4qTBjsMvGN7V0fRPSTLT/24sneG	7	t	\N	\N	\N	\N	2
28	prueba222@test.com	$2b$10$/sTsKRGN6FP.xaK2MqAFdeQUHi3BgXqCkoH9zYz5ffbtwcB3eAsOC	7	t	\N	\N	\N	\N	10
\.


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 220
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresas_id_seq', 19, true);


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 222
-- Name: eventos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_id_seq', 4, true);


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 241
-- Name: gastos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gastos_id_seq', 1, false);


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 232
-- Name: metodos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.metodos_id_seq', 41, true);


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 247
-- Name: objetos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.objetos_id_seq', 5, true);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 239
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_id_seq', 7, true);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 234
-- Name: permisos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permisos_id_seq', 39, true);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 225
-- Name: registros_eventos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registros_eventos_id_seq', 1, false);


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 227
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 7, true);


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 245
-- Name: subsistemas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subsistemas_id_seq', 9, true);


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 236
-- Name: tx_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tx_id_seq', 15, true);


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 243
-- Name: tx_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tx_id_seq1', 10, true);


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 231
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 29, true);


--
-- TOC entry 4970 (class 2606 OID 16578)
-- Name: empresas empresas_nombre_empresa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_nombre_empresa_key UNIQUE (nombre_empresa);


--
-- TOC entry 4972 (class 2606 OID 16580)
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id);


--
-- TOC entry 4974 (class 2606 OID 16582)
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id);


--
-- TOC entry 5016 (class 2606 OID 16873)
-- Name: gastos gastos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gastos
    ADD CONSTRAINT gastos_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 16693)
-- Name: metodos metodos_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodos
    ADD CONSTRAINT metodos_nombre_key UNIQUE (nombre);


--
-- TOC entry 4999 (class 2606 OID 16691)
-- Name: metodos metodos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodos
    ADD CONSTRAINT metodos_pkey PRIMARY KEY (id);


--
-- TOC entry 5025 (class 2606 OID 16936)
-- Name: objetos objetos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objetos
    ADD CONSTRAINT objetos_pkey PRIMARY KEY (id);


--
-- TOC entry 5014 (class 2606 OID 16850)
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- TOC entry 4976 (class 2606 OID 16584)
-- Name: perfiles perfiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT perfiles_pkey PRIMARY KEY (usuario_id);


--
-- TOC entry 5002 (class 2606 OID 16704)
-- Name: permisos permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_pkey PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 16973)
-- Name: permisos permisos_unicos; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_unicos UNIQUE (rol_id, transaccion_id);


--
-- TOC entry 4978 (class 2606 OID 16586)
-- Name: registros_eventos registros_eventos_evento_id_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_eventos
    ADD CONSTRAINT registros_eventos_evento_id_usuario_id_key UNIQUE (evento_id, usuario_id);


--
-- TOC entry 4980 (class 2606 OID 16588)
-- Name: registros_eventos registros_eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_eventos
    ADD CONSTRAINT registros_eventos_pkey PRIMARY KEY (id);


--
-- TOC entry 4982 (class 2606 OID 16590)
-- Name: roles roles_nombre_rol_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_rol_key UNIQUE (nombre_rol);


--
-- TOC entry 4984 (class 2606 OID 16592)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4987 (class 2606 OID 16594)
-- Name: sessiones sessiones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessiones
    ADD CONSTRAINT sessiones_pkey PRIMARY KEY (sid);


--
-- TOC entry 5021 (class 2606 OID 16925)
-- Name: subsistemas subsistemas_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subsistemas
    ADD CONSTRAINT subsistemas_nombre_key UNIQUE (nombre);


--
-- TOC entry 5023 (class 2606 OID 16923)
-- Name: subsistemas subsistemas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subsistemas
    ADD CONSTRAINT subsistemas_pkey PRIMARY KEY (id);


--
-- TOC entry 5012 (class 2606 OID 16807)
-- Name: tx_metodos tx_metodos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_metodos
    ADD CONSTRAINT tx_metodos_pkey PRIMARY KEY (tx_id, metodo_id);


--
-- TOC entry 5009 (class 2606 OID 16790)
-- Name: tx_ejecuciones tx_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_ejecuciones
    ADD CONSTRAINT tx_pkey PRIMARY KEY (id);


--
-- TOC entry 5019 (class 2606 OID 16897)
-- Name: tx tx_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx
    ADD CONSTRAINT tx_pkey1 PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 16596)
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (sid);


--
-- TOC entry 4992 (class 2606 OID 16598)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4994 (class 2606 OID 16600)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 1259 OID 16601)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.user_sessions USING btree (expire);


--
-- TOC entry 4995 (class 1259 OID 16837)
-- Name: idx_metodos_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_metodos_nombre ON public.metodos USING btree (nombre);


--
-- TOC entry 5000 (class 1259 OID 16981)
-- Name: idx_permisos_rol_tx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_permisos_rol_tx ON public.permisos USING btree (rol_id, transaccion_id);


--
-- TOC entry 4985 (class 1259 OID 16602)
-- Name: idx_sessiones_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessiones_expire ON public.sessiones USING btree (expire);


--
-- TOC entry 5005 (class 1259 OID 16835)
-- Name: idx_tx_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tx_estado ON public.tx_ejecuciones USING btree (estado);


--
-- TOC entry 5017 (class 1259 OID 16951)
-- Name: idx_tx_llave; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_tx_llave ON public.tx USING btree (llave);


--
-- TOC entry 5006 (class 1259 OID 16834)
-- Name: idx_tx_metodo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tx_metodo ON public.tx_ejecuciones USING btree (metodo_id);


--
-- TOC entry 5010 (class 1259 OID 16836)
-- Name: idx_tx_metodos_tx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tx_metodos_tx ON public.tx_metodos USING btree (tx_id);


--
-- TOC entry 5007 (class 1259 OID 16833)
-- Name: idx_tx_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tx_usuario ON public.tx_ejecuciones USING btree (usuario_id);


--
-- TOC entry 5036 (class 2606 OID 16903)
-- Name: tx_metodos fk_metodo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_metodos
    ADD CONSTRAINT fk_metodo FOREIGN KEY (metodo_id) REFERENCES public.metodos(id);


--
-- TOC entry 5037 (class 2606 OID 16898)
-- Name: tx_metodos fk_tx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_metodos
    ADD CONSTRAINT fk_tx FOREIGN KEY (tx_id) REFERENCES public.tx(id);


--
-- TOC entry 5041 (class 2606 OID 16879)
-- Name: gastos gastos_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gastos
    ADD CONSTRAINT gastos_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id);


--
-- TOC entry 5042 (class 2606 OID 16874)
-- Name: gastos gastos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gastos
    ADD CONSTRAINT gastos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5030 (class 2606 OID 16942)
-- Name: metodos metodos_objeto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodos
    ADD CONSTRAINT metodos_objeto_id_fkey FOREIGN KEY (objeto_id) REFERENCES public.objetos(id);


--
-- TOC entry 5046 (class 2606 OID 16937)
-- Name: objetos objetos_subsistema_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objetos
    ADD CONSTRAINT objetos_subsistema_id_fkey FOREIGN KEY (subsistema_id) REFERENCES public.subsistemas(id);


--
-- TOC entry 5039 (class 2606 OID 16856)
-- Name: pagos pagos_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id);


--
-- TOC entry 5040 (class 2606 OID 16851)
-- Name: pagos pagos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5026 (class 2606 OID 16603)
-- Name: perfiles perfiles_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT perfiles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5031 (class 2606 OID 16705)
-- Name: permisos permisos_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 5032 (class 2606 OID 16908)
-- Name: permisos permisos_transaccion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_transaccion_id_fkey FOREIGN KEY (transaccion_id) REFERENCES public.tx(id);


--
-- TOC entry 5027 (class 2606 OID 16608)
-- Name: registros_eventos registros_eventos_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_eventos
    ADD CONSTRAINT registros_eventos_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id);


--
-- TOC entry 5033 (class 2606 OID 16967)
-- Name: tx_ejecuciones tx_ejecuciones_tx_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_ejecuciones
    ADD CONSTRAINT tx_ejecuciones_tx_id_fkey FOREIGN KEY (tx_id) REFERENCES public.tx(id);


--
-- TOC entry 5034 (class 2606 OID 16796)
-- Name: tx_ejecuciones tx_metodo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_ejecuciones
    ADD CONSTRAINT tx_metodo_id_fkey FOREIGN KEY (metodo_id) REFERENCES public.metodos(id) ON DELETE CASCADE;


--
-- TOC entry 5043 (class 2606 OID 16957)
-- Name: tx tx_metodo_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx
    ADD CONSTRAINT tx_metodo_id_fkey1 FOREIGN KEY (metodo_id) REFERENCES public.metodos(id);


--
-- TOC entry 5038 (class 2606 OID 16813)
-- Name: tx_metodos tx_metodos_metodo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_metodos
    ADD CONSTRAINT tx_metodos_metodo_id_fkey FOREIGN KEY (metodo_id) REFERENCES public.metodos(id) ON DELETE CASCADE;


--
-- TOC entry 5044 (class 2606 OID 16962)
-- Name: tx tx_objeto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx
    ADD CONSTRAINT tx_objeto_id_fkey FOREIGN KEY (objeto_id) REFERENCES public.objetos(id);


--
-- TOC entry 5045 (class 2606 OID 16952)
-- Name: tx tx_subsistema_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx
    ADD CONSTRAINT tx_subsistema_id_fkey FOREIGN KEY (subsistema_id) REFERENCES public.subsistemas(id);


--
-- TOC entry 5035 (class 2606 OID 16791)
-- Name: tx_ejecuciones tx_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_ejecuciones
    ADD CONSTRAINT tx_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5028 (class 2606 OID 16613)
-- Name: usuarios usuarios_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5029 (class 2606 OID 16618)
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id);


-- Completed on 2025-11-14 00:07:47

--
-- PostgreSQL database dump complete
--

\unrestrict MHWSu0t3xWmeoqayOQIafI6N67ZopWuYeEA0eSg4gVFoMiEHwF59azEccbZTNJX

