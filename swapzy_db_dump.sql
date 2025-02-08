--
-- PostgreSQL database dump
--

-- Dumped from database version 16.5 (Ubuntu 16.5-1.pgdg22.04+1)
-- Dumped by pg_dump version 17.1 (Ubuntu 17.1-1.pgdg22.04+1)

-- Started on 2024-12-08 13:12:17 GMT

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
-- TOC entry 2 (class 3079 OID 17162)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 4345 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- TOC entry 1641 (class 1247 OID 18270)
-- Name: enum_product_condition; Type: TYPE; Schema: public; Owner: dev_username
--

CREATE TYPE public.enum_product_condition AS ENUM (
    'new',
    'like new',
    'used',
    'damaged'
);


ALTER TYPE public.enum_product_condition OWNER TO dev_username;

--
-- TOC entry 1644 (class 1247 OID 18280)
-- Name: enum_product_status; Type: TYPE; Schema: public; Owner: dev_username
--

CREATE TYPE public.enum_product_status AS ENUM (
    'available',
    'sold',
    'reserved'
);


ALTER TYPE public.enum_product_status OWNER TO dev_username;

--
-- TOC entry 1647 (class 1247 OID 18414)
-- Name: enum_sale_status; Type: TYPE; Schema: public; Owner: dev_username
--

CREATE TYPE public.enum_sale_status AS ENUM (
    'pending',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_sale_status OWNER TO dev_username;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 17044)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: dev_username
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO dev_username;

--
-- TOC entry 225 (class 1259 OID 18782)
-- Name: category; Type: TABLE; Schema: public; Owner: dev_username
--

CREATE TABLE public.category (
    name_id character varying(255) NOT NULL,
    image character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.category OWNER TO dev_username;

--
-- TOC entry 227 (class 1259 OID 18790)
-- Name: favorite; Type: TABLE; Schema: public; Owner: dev_username
--

CREATE TABLE public.favorite (
    id integer NOT NULL,
    "user" character varying(255) NOT NULL,
    product_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.favorite OWNER TO dev_username;

--
-- TOC entry 226 (class 1259 OID 18789)
-- Name: favorite_id_seq; Type: SEQUENCE; Schema: public; Owner: dev_username
--

CREATE SEQUENCE public.favorite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorite_id_seq OWNER TO dev_username;

--
-- TOC entry 4346 (class 0 OID 0)
-- Dependencies: 226
-- Name: favorite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_username
--

ALTER SEQUENCE public.favorite_id_seq OWNED BY public.favorite.id;


--
-- TOC entry 224 (class 1259 OID 18742)
-- Name: product; Type: TABLE; Schema: public; Owner: dev_username
--

CREATE TABLE public.product (
    id integer NOT NULL,
    seller character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    condition public.enum_product_condition NOT NULL,
    price numeric NOT NULL,
    category character varying(255) NOT NULL,
    location public.geography(Point,4326) NOT NULL,
    image_url character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.product OWNER TO dev_username;

--
-- TOC entry 223 (class 1259 OID 18741)
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: dev_username
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_id_seq OWNER TO dev_username;

--
-- TOC entry 4347 (class 0 OID 0)
-- Dependencies: 223
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_username
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- TOC entry 222 (class 1259 OID 18732)
-- Name: users; Type: TABLE; Schema: public; Owner: dev_username
--

CREATE TABLE public.users (
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    location public.geography(Point,4326),
    profile_img character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO dev_username;

--
-- TOC entry 4348 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN users.location; Type: COMMENT; Schema: public; Owner: dev_username
--

COMMENT ON COLUMN public.users.location IS 'Location (latitude, longitude)';


--
-- TOC entry 4168 (class 2604 OID 18793)
-- Name: favorite id; Type: DEFAULT; Schema: public; Owner: dev_username
--

ALTER TABLE ONLY public.favorite ALTER COLUMN id SET DEFAULT nextval('public.favorite_id_seq'::regclass);


--
-- TOC entry 4167 (class 2604 OID 18745)
-- Name: product id; Type: DEFAULT; Schema: public; Owner: dev_username
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- TOC entry 4332 (class 0 OID 17044)
-- Dependencies: 216
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: dev_username
--

COPY public."SequelizeMeta" (name) FROM stdin;
20241013200055-create-user.js
20241014130605-create-product.js
20241019165653-create-category.js
20241019171218-create-favorite.js
\.


--
-- TOC entry 4336 (class 0 OID 18782)
-- Dependencies: 225
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: dev_username
--

COPY public.category (name_id, image, created_at, updated_at) FROM stdin;
cars	directions_car	2024-11-25 12:08:33.297+00	2024-11-25 12:08:33.297+00
home & garden	chair	2024-11-25 12:08:33.303+00	2024-11-25 12:08:33.303+00
sports	sports_basketball	2024-11-25 12:08:33.304+00	2024-11-25 12:08:33.304+00
household applicances	local_laundry_service	2024-11-25 12:08:33.305+00	2024-11-25 12:08:33.305+00
books, music & cinema	import_contacts	2024-11-25 12:08:33.307+00	2024-11-25 12:08:33.307+00
technology & electronics	computer	2024-11-25 12:08:33.308+00	2024-11-25 12:08:33.308+00
others	more_horiz	2024-11-25 12:08:33.309+00	2024-11-25 12:08:33.309+00
fashion	checkroom	2024-11-25 12:08:33.302+00	2024-11-25 13:11:12.109+00
\.


--
-- TOC entry 4338 (class 0 OID 18790)
-- Dependencies: 227
-- Data for Name: favorite; Type: TABLE DATA; Schema: public; Owner: dev_username
--

COPY public.favorite (id, "user", product_id, created_at, updated_at) FROM stdin;
34	qwerty	16	2024-11-25 20:40:51.977+00	2024-11-25 20:40:51.977+00
40	qwerty	17	2024-11-25 20:48:14.562+00	2024-11-25 20:48:14.562+00
41	qwerty	15	2024-11-25 20:48:19.524+00	2024-11-25 20:48:19.524+00
42	qwerty	32	2024-12-03 00:55:39.684+00	2024-12-03 00:55:39.684+00
43	qwerty	30	2024-12-03 00:55:43.679+00	2024-12-03 00:55:43.679+00
\.


--
-- TOC entry 4335 (class 0 OID 18742)
-- Dependencies: 224
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: dev_username
--

COPY public.product (id, seller, name, description, condition, price, category, location, image_url, created_at, updated_at) FROM stdin;
18	qwerty	masserati	beautiful blue masserati	new	50000	cars	0101000020E6100000FD2488049D5AC0BFE23F38FAF3C04940	https://carwow-uk-wp-3.imgix.net/18015-MC20BluInfinito-scaled-e1707920217641.jpg	2024-12-02 20:46:29.717+00	2024-12-02 20:46:29.717+00
19	qwerty	multicolor car	multicolor fast car 	like new	40000	cars	0101000020E6100000B3ACA00ED00A19C04832AB77B8AC4A40	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc_cDO5iJPbmgeh1IdgOfjkHhOU3_sLH1HIQ&s	2024-12-02 20:47:32.409+00	2024-12-02 20:47:32.409+00
20	qwerty	Nissan GTR	grey nissan gtr	like new	30000	cars	0101000020E61000007FF62345640C54C0E773493030C63940	https://wallpapers.com/images/hd/1920x1080-hd-car-ygb3bvz7wrfyyr5h.jpg	2024-12-02 20:48:23.145+00	2024-12-02 20:48:23.145+00
21	qwerty	porsche 911	the most beautiful car: Porsche 911 :)	new	600000	cars	0101000020E61000002C595F6E41CC2A402C82FFAD64414A40	https://getwallpapers.com/wallpaper/full/e/2/a/1354883-full-size-black-and-red-car-wallpaper-1920x1200-hd.jpg	2024-12-02 20:49:33.67+00	2024-12-02 20:49:33.67+00
22	qwerty	RX7	https://gallery.yopriceville.com/downloadfullsize/send/639	used	7000	cars	0101000020E6100000A94D9CDCEFA00DC0744B619456354440	https://gallery.yopriceville.com/downloadfullsize/send/639	2024-12-02 20:50:37.168+00	2024-12-02 20:50:37.168+00
23	qwerty	Dodge challenger	red and black dodge challenger muscle car	like new	20000	cars	0101000020E61000002BA5677A898F5DC0E1CBE957DF064140	https://wallpaperboat.com/wp-content/uploads/2019/10/1920-x-1080-car-01.jpg	2024-12-02 20:51:56.14+00	2024-12-02 20:51:56.14+00
24	qwerty	muscle car	black muscle car	damaged	15000	cars	0101000020E6100000040FC292616B0140402BD5AA02B14440	https://wallscloud.net/img/resize/1920/1080/MM/2023-03-24-muscle-car-1-58448.jpeg	2024-12-02 20:52:57.446+00	2024-12-02 20:52:57.446+00
25	qwerty	american car	black american muscle car	used	9000	cars	0101000020E6100000FA87E3AFFF3258C0E2A6ABE05C634040	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD-SvyPITpAVwpSdMJrUI9uQcAzeOMUm25Fg&s	2024-12-02 20:53:38.077+00	2024-12-02 20:53:38.077+00
26	qwerty	white nissan gtr	white snowy gtr	like new	21000	cars	0101000020E61000008BCC1253D8CB0CC0A92F4B3B35964240	https://wallpapercave.com/wp/wp2552873.jpg	2024-12-02 20:54:23.326+00	2024-12-02 20:54:23.326+00
27	qwerty	rolls royce	white rolls royce	damaged	55000	cars	0101000020E6100000C0E95DBC1F955EC033E3C85E4ACD4740	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNHA5zKcxpJ6J0YpZL2MMJJjzkgTOOAA4oZg&s	2024-12-02 20:55:18.579+00	2024-12-02 20:55:18.579+00
28	qwerty	Shelby gt	blue ford mustang shelby gt	new	45000	cars	0101000020E6100000D9D1938D628052C05938A4AC3A5B4440	https://wallpapercave.com/wp/wp2619682.jpg	2024-12-02 20:56:04.227+00	2024-12-02 20:56:04.227+00
29	qwerty	flowers	flowers from my garden	new	5	home & garden	0101000020E6100000B3ACA00ED00A19C04832AB77B8AC4A40	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUh5yblOeekiOQSLLQdBLUDFSYRZGDs93qSg&s	2024-12-02 20:56:50.222+00	2024-12-02 20:56:50.222+00
30	qwerty	basketball	wilson basketball	used	25	sports	0101000020E6100000A94D9CDCEFA00DC0744B619456354440	https://m.media-amazon.com/images/I/81mg8K+coMS._AC_UF1000,1000_QL80_.jpg	2024-12-02 20:57:28.469+00	2024-12-02 20:57:28.469+00
32	qwerty	gray sofa	gray 2p sofa, very comfortable	like new	100	home & garden	0101000020E6100000B3ACA00ED00A19C04832AB77B8AC4A40	https://d3930c7dxygvzp.cloudfront.net/media/catalog/product/a/v/avoca-3-vitolini-361-0104-like-oak-1_2naan5sypmzf2n3m.jpg?width=1280&height=750&store=ireland_store_view&image-type=image	2024-12-02 20:58:57.492+00	2024-12-02 20:58:57.492+00
\.


--
-- TOC entry 4166 (class 0 OID 17484)
-- Dependencies: 218
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- TOC entry 4333 (class 0 OID 18732)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dev_username
--

COPY public.users (username, email, password, location, profile_img, created_at, updated_at) FROM stdin;
qwerty2	qwerty2@test.com	$2a$08$vzxwH5mS31CrOHNSjSrLGuXM7/vBdIaNp3yTN4fHPdghJLN2V0t9y	\N	\N	2024-11-25 13:27:55.088+00	2024-11-25 13:27:55.088+00
qwerty	qwerty@test.com	$2a$08$kQ5DsXQLGTWI./TeGzmy1etu/WH.lS0489ty9CGK8.ZBhTco2cnVy	0101000020E6100000B3ACA00ED00A19C04832AB77B8AC4A40	https://m.media-amazon.com/images/I/51FafmmUhrL._AC_UY350_.jpg	2024-11-18 00:12:56.314+00	2024-12-03 12:09:52.539+00
\.


--
-- TOC entry 4349 (class 0 OID 0)
-- Dependencies: 226
-- Name: favorite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_username
--

SELECT pg_catalog.setval('public.favorite_id_seq', 43, true);


--
-- TOC entry 4350 (class 0 OID 0)
-- Dependencies: 223
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_username
--

SELECT pg_catalog.setval('public.product_id_seq', 32, true);


--
-- TOC entry 4171 (class 2606 OID 17048)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_username
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 4181 (class 2606 OID 18788)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_username
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (name_id);


--
-- TOC entry 4183 (class 2606 OID 18795)
-- Name: favorite favorite_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_username
--

ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_pkey PRIMARY KEY (id);


--
-- TOC entry 4179 (class 2606 OID 18749)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_username
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 4175 (class 2606 OID 18740)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: dev_username
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4177 (class 2606 OID 18738)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_username
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- TOC entry 4344 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO dev_username;


-- Completed on 2024-12-08 13:12:18 GMT

--
-- PostgreSQL database dump complete
--

