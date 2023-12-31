-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public.addresses
(
    id bigint NOT NULL DEFAULT nextval('addresses_id_seq'::regclass),
    street_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    longitude numeric(9, 6),
    latitude numeric(9, 6),
    CONSTRAINT addresses_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.authorities
(
    id bigint NOT NULL DEFAULT nextval('authorities_id_seq'::regclass),
    authority_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT authorities_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.categories
(
    id bigint NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT categories_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.items
(
    discount real NOT NULL,
    price real NOT NULL,
    category_id bigint NOT NULL,
    id bigint NOT NULL DEFAULT nextval('items_id_seq'::regclass),
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    image bytea NOT NULL,
    image_mime_type character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT items_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_details
(
    quantity integer NOT NULL,
    id bigint NOT NULL DEFAULT nextval('order_details_id_seq'::regclass),
    item_id bigint NOT NULL,
    order_id bigint NOT NULL,
    CONSTRAINT order_details_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_status
(
    id bigint NOT NULL DEFAULT nextval('order_status_id_seq'::regclass),
    status_value character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT order_status_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.orders
(
    id bigint NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
    status_id bigint NOT NULL,
    user_id bigint NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.users
(
    address_id bigint NOT NULL,
    id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    fullname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.users_authorities
(
    authority_id bigint NOT NULL,
    user_id bigint NOT NULL
);

ALTER TABLE IF EXISTS public.items
    ADD CONSTRAINT fkjcdcde7htb3tyjgouo4g9xbmr FOREIGN KEY (category_id)
        REFERENCES public.categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.order_details
    ADD CONSTRAINT fkjyu2qbqt8gnvno9oe9j2s2ldk FOREIGN KEY (order_id)
        REFERENCES public.orders (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.order_details
    ADD CONSTRAINT fknfrrgu0scdkwpptvs5gx6m6o9 FOREIGN KEY (item_id)
        REFERENCES public.items (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.orders
    ADD CONSTRAINT fk2n7p8t83wo7x0lep1q06a6cvy FOREIGN KEY (status_id)
        REFERENCES public.order_status (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.orders
    ADD CONSTRAINT fk32ql8ubntj5uh44ph9659tiih FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.users
    ADD CONSTRAINT fke8vydtk7hf0y16bfm558sywbb FOREIGN KEY (address_id)
        REFERENCES public.addresses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.users_authorities
    ADD CONSTRAINT fkdsfxx5g8x8mnxne1fe0yxhjhq FOREIGN KEY (authority_id)
        REFERENCES public.authorities (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.users_authorities
    ADD CONSTRAINT fkq3lq694rr66e6kpo2h84ad92q FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

END;