--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: BlogPosts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogPosts" (
    "Id" uuid NOT NULL,
    "Title" text NOT NULL,
    "Slug" text NOT NULL,
    "Content" text NOT NULL,
    "Thumbnail" text,
    "AuthorId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."BlogPosts" OWNER TO postgres;

--
-- Name: Categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Categories" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Slug" text NOT NULL,
    "ParentId" uuid,
    "OrderIndex" integer NOT NULL,
    "IsVisible" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."Categories" OWNER TO postgres;

--
-- Name: Customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customers" (
    "Id" uuid NOT NULL,
    "PhoneNumber" text NOT NULL,
    "Name" text NOT NULL,
    "Source" integer NOT NULL,
    "Status" integer NOT NULL,
    "Note" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "Address" text
);


ALTER TABLE public."Customers" OWNER TO postgres;

--
-- Name: Products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Products" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Slug" text NOT NULL,
    "OriginalPrice" numeric NOT NULL,
    "DiscountPrice" numeric,
    "DiscountPercent" double precision,
    "Description" text,
    "CategoryId" uuid NOT NULL,
    "Images" text,
    "CustomOptions" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."Products" OWNER TO postgres;

--
-- Name: ProjectImages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectImages" (
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "ImageUrl" text NOT NULL,
    "Caption" text,
    "OrderIndex" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."ProjectImages" OWNER TO postgres;

--
-- Name: ProjectProducts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectProducts" (
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "ProductId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."ProjectProducts" OWNER TO postgres;

--
-- Name: Projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Projects" (
    "Id" uuid NOT NULL,
    "Title" text NOT NULL,
    "Slug" text NOT NULL,
    "Description" text,
    "Content" text,
    "Tags" text,
    "VideoUrl" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "Thumbnail" text
);


ALTER TABLE public."Projects" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    "Id" uuid NOT NULL,
    "Email" text NOT NULL,
    "PasswordHash" text NOT NULL,
    "Role" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- Data for Name: BlogPosts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogPosts" ("Id", "Title", "Slug", "Content", "Thumbnail", "AuthorId", "CreatedAt", "UpdatedAt") FROM stdin;
\.


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Categories" ("Id", "Name", "Slug", "ParentId", "OrderIndex", "IsVisible", "CreatedAt", "UpdatedAt") FROM stdin;
2d8b5687-1319-410a-8c35-d683825e732e	Phòng Bếp	phong-bep	\N	3	t	2026-03-26 02:18:14.636185+07	\N
848a59b7-9c0a-4907-b9c6-8fe11e06a0aa	Phòng Khách	phong-khach	\N	1	t	2026-03-26 02:18:14.636045+07	\N
bbad71be-efc9-4200-90d0-82fd9b93dcef	Văn Phòng	van-phong	\N	4	t	2026-03-26 02:18:14.636203+07	\N
eba9744a-2793-4049-962c-44cc242d6b85	Phòng Ngủ	phong-ngu	\N	2	t	2026-03-26 02:18:14.636185+07	\N
a3827c42-9679-4c52-9a2c-74293f53d0b9	test1	test2	eba9744a-2793-4049-962c-44cc242d6b85	0	t	2026-03-26 02:50:19.580809+07	\N
9163e4d8-d560-4f08-96f4-977ec7fee51e	test2	test2	eba9744a-2793-4049-962c-44cc242d6b85	1	t	2026-03-26 02:50:30.398039+07	\N
95dec9ec-6e4e-4599-b4b6-8116885ceed0	abc	abc	848a59b7-9c0a-4907-b9c6-8fe11e06a0aa	1	t	2026-03-26 11:43:06.260594+07	\N
ddc840f3-d77f-469c-b9fb-ea0b0b5dfba8	Thắng đz	thangdz	848a59b7-9c0a-4907-b9c6-8fe11e06a0aa	2	t	2026-03-26 11:43:22.316023+07	\N
6c3aef0c-c84d-4ad3-9087-b052a862feeb	Nghĩa đz	nghiadz	848a59b7-9c0a-4907-b9c6-8fe11e06a0aa	3	t	2026-03-26 11:43:35.759415+07	2026-03-26 11:43:49.739572+07
\.


--
-- Data for Name: Customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customers" ("Id", "PhoneNumber", "Name", "Source", "Status", "Note", "CreatedAt", "UpdatedAt", "Address") FROM stdin;
0b4275cd-8e42-4ac7-9105-e2cec57c7042	0987654123	123	2	1		2026-03-26 04:26:48.632198+07	\N	\N
c46a81a6-9732-48e0-92ad-d2efc0c6f6f7	0987654321	a	0	0	\N	2026-03-26 04:28:11.333197+07	\N	\N
5c74d248-4f30-4d9e-a74f-92d5f5c8fed3	test	tét	2	0	\N	2026-03-26 04:29:03.139841+07	\N	\N
adbe434d-d304-40c4-8bec-8a5f49347bdc	0123456789	Khách từ Chat	3	0	\N	2026-03-26 04:30:27.296785+07	\N	\N
4bce238e-bbe5-4d10-a71b-25445a254a5f	te	te	2	0	\N	2026-03-26 04:32:35.764899+07	\N	\N
36a78f46-825a-4231-b1d8-0e5876e42868	456	123	2	0	\N	2026-03-26 10:04:55.335327+07	\N	\N
11d96d5f-f421-458c-a53c-8e31fe76a367	0511349971	Khách từ Chat	3	1		2026-03-26 10:43:57.413051+07	\N	\N
dbd61011-a74f-411e-98e1-b422afc710b9	456	123	2	2		2026-03-26 10:58:13.225185+07	\N	\N
8fcd67b1-4fd4-4a45-8ba1-e9c124f609b7	123456	Khách từ Chat	3	1	Tủ bếp, 6m	2026-03-26 10:58:59.875276+07	\N	Thanh Hóa
bca8b7ac-d4ea-4219-a4e2-8cf09390983c	0987654321	Đỗ Văn Nghĩa	1	0	\N	2026-03-26 11:38:05.985886+07	\N	\N
75ab5508-1b3a-446a-a3d2-2cdd07b4320f	0987654321	Khách từ Chat	1	0	\N	2026-03-26 11:38:27.824638+07	\N	\N
05238dd4-3395-484d-8d04-356dfc05c679	0987654321	Nghĩa đz	1	0	\N	2026-03-26 11:39:22.593412+07	\N	\N
0f0fac88-9270-45d5-84cd-163fc45790e5	0987654321	Đỗ Nghĩa	1	1	Bếp 6m	2026-03-26 11:39:39.419474+07	\N	Thanh Hóa
1c4c90c5-7ace-4750-a672-93993d3345ad	test	test	1	0	\N	2026-03-26 11:41:21.346988+07	\N	\N
8b339f2f-101f-43d9-9239-271d15e6b4f4	test	test	1	0	\N	2026-03-26 11:41:39.869965+07	\N	\N
2adc9ae3-4ee2-4456-8857-0842304a96b8	test	test	1	0	\N	2026-03-26 11:41:53.799964+07	\N	\N
f6fb5538-e5cb-48cc-bf03-98ea7d956774	021235560	Khách từ Chat	1	0	\N	2026-03-26 13:38:51.833759+07	\N	\N
\.


--
-- Data for Name: Products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Products" ("Id", "Name", "Slug", "OriginalPrice", "DiscountPrice", "DiscountPercent", "Description", "CategoryId", "Images", "CustomOptions", "CreatedAt", "UpdatedAt") FROM stdin;
1882a282-c594-4300-9548-ad4f6f7ee98f	Sofa Góc Chữ L Hiện Đại	sofa-goc-chu-l-hien-dai	25000000	19800000	20.8	Sofa góc chữ L bọc da cao cấp, 5 chỗ ngồi, khung gỗ An Cường, phù hợp phòng khách từ 20m².	848a59b7-9c0a-4907-b9c6-8fe11e06a0aa	https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800	\N	2026-03-26 02:18:14.707366+07	\N
6980fa43-d521-4118-bdf4-a510428ac1ef	Bàn Làm Việc Executive	ban-lam-viec-executive	12000000	9500000	20.8	Bàn làm việc mặt gỗ tự nhiên sồi Nga, khung thép, có ngăn kéo khóa, kích thước 160x80cm.	bbad71be-efc9-4200-90d0-82fd9b93dcef	https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800	\N	2026-03-26 02:18:14.707815+07	\N
71c7abac-ae84-44c7-bc0c-6e46fbaf2fe7	Giường Ngủ Gỗ MDF Cao Cấp	giuong-ngu-go-mdf-cao-cap	15000000	12500000	16.7	Giường đôi 1m8x2m, đầu giường bọc da, chân gỗ sồi, hộc kéo tiện lợi.	eba9744a-2793-4049-962c-44cc242d6b85	https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=800	\N	2026-03-26 02:18:14.707814+07	\N
74866f49-5266-4db3-a48d-fea00855cd8c	Tủ Quần Áo 4 Cánh Âm Tường	tu-quan-ao-4-canh-am-tuong	22000000	\N	\N	Tủ âm tường 4 cánh lùa, gương tích hợp, hệ thống ngăn kéo thông minh, cánh gỗ công nghiệp phủ Melamine.	eba9744a-2793-4049-962c-44cc242d6b85	https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800	\N	2026-03-26 02:18:14.707814+07	\N
dabfdd39-6979-4795-9aa9-4d52d1a7b13f	Bàn Trà Kính Cường Lực	ban-tra-kinh-cuong-luc	8500000	6990000	17.8	Bàn trà mặt kính cường lực 10mm, chân thép sơn tĩnh điện, kích thước 120x60cm.	848a59b7-9c0a-4907-b9c6-8fe11e06a0aa	https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=800	\N	2026-03-26 02:18:14.707813+07	\N
e33c2fba-6cac-4c78-8fb6-19dd8fae5903	Tủ Bếp Chữ L Acrylic Bóng	tu-bep-chu-l-acrylic-bong	45000000	38000000	15.6	Tủ bếp chữ L cánh Acrylic bóng gương, ray âm giảm chấn Blum, countertop đá nhân tạo.	2d8b5687-1319-410a-8c35-d683825e732e	https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=80&w=800	\N	2026-03-26 02:18:14.707815+07	\N
\.


--
-- Data for Name: ProjectImages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectImages" ("Id", "ProjectId", "ImageUrl", "Caption", "OrderIndex", "CreatedAt", "UpdatedAt") FROM stdin;
\.


--
-- Data for Name: ProjectProducts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectProducts" ("Id", "ProjectId", "ProductId", "CreatedAt", "UpdatedAt") FROM stdin;
\.


--
-- Data for Name: Projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Projects" ("Id", "Title", "Slug", "Description", "Content", "Tags", "VideoUrl", "CreatedAt", "UpdatedAt", "Thumbnail") FROM stdin;
205308cd-75c4-49db-aea7-bd35bb8b815f	Căn Hộ Penthouse Q7 - 320m²	can-ho-penthouse-q7	Penthouse tầng 38 với view sông Sài Gòn, thiết kế Open Space kết hợp bếp đảo và phòng khách liền mạch.	Điểm nhấn là hệ thống đèn RGB thông minh điều khiển qua app và cầu thang xoắn ốc nội thất bằng thép nguyên khối.	Penthouse,Hiện Đại,Quận 7	\N	2026-03-26 02:18:14.766622+07	\N	\N
3fe09e7c-521e-4b81-b50d-c9ae2262b27a	Biệt Thự Vinhomes Ocean Park - 450m²	biet-thu-vinhomes-ocean-park	Thiết kế và thi công nội thất trọn gói biệt thự song lập 450m² theo phong cách Modern Luxury. Sử dụng toàn bộ vật liệu nhập khẩu từ Ý và Đức.	Dự án được hoàn thành trong 4 tháng với đội ngũ 25 kỹ sư và thợ lành nghề. Tổng giá trị hợp đồng 2.8 tỉ đồng.	Modern Luxury,Biệt Thự,Vinhomes	\N	2026-03-26 02:18:14.766466+07	\N	\N
36c1f090-db25-4c5c-8c95-8fdcd60b8458	Văn Phòng Công Ty Fintech 200m²	van-phong-cong-ty-fintech	Văn phòng theo concept Industrial Chic với tường gạch mộc, đường ống lộ và không gian làm việc chung (co-working) linh hoạt.	<!DOCTYPE html>\n<html lang="vi">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Trang đơn giản</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            line-height: 1.6;\n            padding: 20px;\n            max-width: 800px;\n            margin: auto;\n        }\n        img {\n            width: 100%;\n            border-radius: 10px;\n            margin: 20px 0;\n        }\n    </style>\n</head>\n<body>\n\n    <p>\n        Cuộc sống là một hành trình dài với nhiều thử thách và cơ hội. \n        Mỗi ngày trôi qua đều mang đến cho chúng ta những trải nghiệm mới, \n        giúp ta trưởng thành và hiểu rõ hơn về bản thân mình.\n    </p>\n\n    <img src="https://picsum.photos/800/400?random=1" alt="Hình ảnh 1">\n\n    <p>\n        Khi biết tận dụng thời gian và nỗ lực không ngừng, bạn sẽ dần tiến gần hơn \n        đến mục tiêu của mình. Thành công không đến ngay lập tức, nhưng chắc chắn \n        sẽ đến nếu bạn kiên trì.\n    </p>\n\n    <img src="https://picsum.photos/800/400?random=2" alt="Hình ảnh 2">\n\n</body>\n</html>	Văn Phòng,Industrial,Fintech	https://www.youtube.com/watch?v=PG_t34a4OeM&list=RDPG_t34a4OeM&start_radio=1	2026-03-26 02:18:14.766623+07	2026-03-26 03:36:33.556039+07	\N
6bc1de3c-fc9e-4b51-a657-003ff38a9a7c	test	test	test	<!DOCTYPE html>\n<html lang="vi">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Trang đơn giản</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            line-height: 1.6;\n            padding: 20px;\n            max-width: 800px;\n            margin: auto;\n        }\n        img {\n            width: 100%;\n            border-radius: 10px;\n            margin: 20px 0;\n        }\n    </style>\n</head>\n<body>\n\n    <p>\n        Cuộc sống là một hành trình dài với nhiều thử thách và cơ hội. \n        Mỗi ngày trôi qua đều mang đến cho chúng ta những trải nghiệm mới, \n        giúp ta trưởng thành và hiểu rõ hơn về bản thân mình.\n    </p>\n\n    <img src="https://picsum.photos/800/400?random=1" alt="Hình ảnh 1">\n\n    <p>\n        Khi biết tận dụng thời gian và nỗ lực không ngừng, bạn sẽ dần tiến gần hơn \n        đến mục tiêu của mình. Thành công không đến ngay lập tức, nhưng chắc chắn \n        sẽ đến nếu bạn kiên trì.\n    </p>\n\n    <img src="https://picsum.photos/800/400?random=2" alt="Hình ảnh 2">\n\n</body>\n</html>	Biệt thự	https://www.youtube.com/watch?v=9uKBzY9JApQ	2026-03-26 11:45:39.245156+07	\N	\N
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" ("Id", "Email", "PasswordHash", "Role", "CreatedAt", "UpdatedAt") FROM stdin;
08d966df-15ac-4a2f-be5b-02ee71224aba	admin@nvhome.com	$2a$13$/7uJFvFSn2QSSig90mISjOhj5DJkzUkmGL/tNkpQhWwSKO2nsnAti	0	2026-03-26 02:17:52.977998+07	\N
\.


--
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20260325183812_InitialPostgres	10.0.5
20260325184451_AddUpdatedAt	10.0.5
20260325201733_UpdateProjectSchema	10.0.5
20260325201927_AddNavigationProperties	10.0.5
20260325210952_AddCustomerTable	10.0.5
20260326042710_AddAddressToCustomer	10.0.5
20260326043427_RemoveLeadsAndAppointments	10.0.5
\.


--
-- Name: BlogPosts PK_BlogPosts; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPosts"
    ADD CONSTRAINT "PK_BlogPosts" PRIMARY KEY ("Id");


--
-- Name: Categories PK_Categories; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "PK_Categories" PRIMARY KEY ("Id");


--
-- Name: Customers PK_Customers; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customers"
    ADD CONSTRAINT "PK_Customers" PRIMARY KEY ("Id");


--
-- Name: Products PK_Products; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "PK_Products" PRIMARY KEY ("Id");


--
-- Name: ProjectImages PK_ProjectImages; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectImages"
    ADD CONSTRAINT "PK_ProjectImages" PRIMARY KEY ("Id");


--
-- Name: ProjectProducts PK_ProjectProducts; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectProducts"
    ADD CONSTRAINT "PK_ProjectProducts" PRIMARY KEY ("Id");


--
-- Name: Projects PK_Projects; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Projects"
    ADD CONSTRAINT "PK_Projects" PRIMARY KEY ("Id");


--
-- Name: Users PK_Users; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "PK_Users" PRIMARY KEY ("Id");


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: IX_BlogPosts_AuthorId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_BlogPosts_AuthorId" ON public."BlogPosts" USING btree ("AuthorId");


--
-- Name: IX_Categories_ParentId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Categories_ParentId" ON public."Categories" USING btree ("ParentId");


--
-- Name: IX_Products_CategoryId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Products_CategoryId" ON public."Products" USING btree ("CategoryId");


--
-- Name: IX_ProjectImages_ProjectId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ProjectImages_ProjectId" ON public."ProjectImages" USING btree ("ProjectId");


--
-- Name: IX_ProjectProducts_ProductId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ProjectProducts_ProductId" ON public."ProjectProducts" USING btree ("ProductId");


--
-- Name: IX_ProjectProducts_ProjectId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ProjectProducts_ProjectId" ON public."ProjectProducts" USING btree ("ProjectId");


--
-- Name: IX_Users_Email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_Users_Email" ON public."Users" USING btree ("Email");


--
-- Name: BlogPosts FK_BlogPosts_Users_AuthorId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPosts"
    ADD CONSTRAINT "FK_BlogPosts_Users_AuthorId" FOREIGN KEY ("AuthorId") REFERENCES public."Users"("Id") ON DELETE RESTRICT;


--
-- Name: Categories FK_Categories_Categories_ParentId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "FK_Categories_Categories_ParentId" FOREIGN KEY ("ParentId") REFERENCES public."Categories"("Id") ON DELETE RESTRICT;


--
-- Name: Products FK_Products_Categories_CategoryId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "FK_Products_Categories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES public."Categories"("Id") ON DELETE CASCADE;


--
-- Name: ProjectImages FK_ProjectImages_Projects_ProjectId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectImages"
    ADD CONSTRAINT "FK_ProjectImages_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES public."Projects"("Id") ON DELETE CASCADE;


--
-- Name: ProjectProducts FK_ProjectProducts_Products_ProductId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectProducts"
    ADD CONSTRAINT "FK_ProjectProducts_Products_ProductId" FOREIGN KEY ("ProductId") REFERENCES public."Products"("Id") ON DELETE CASCADE;


--
-- Name: ProjectProducts FK_ProjectProducts_Projects_ProjectId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectProducts"
    ADD CONSTRAINT "FK_ProjectProducts_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES public."Projects"("Id") ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

