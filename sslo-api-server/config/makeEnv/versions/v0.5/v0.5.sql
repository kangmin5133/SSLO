
# version v0.4 to v0.5
# insert into system_info(`version`, `name`, `desc`, `created`, `updated` ) select 'v0.5', 'sslo_db', 'add help table(notification,inquiry,alliance)', DATE('2023-02-14'), DATE('2023-02-14') ; 


# annotation_type 변경 및 추가

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE if  exists `annotation_type`;
CREATE TABLE `annotation_type` (
  `annotation_type_id` int NOT NULL,
  `annotation_type_name` varchar(32) NOT NULL,
  `annotation_type_desc` varchar(512) NOT NULL,
  
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`annotation_type_id`)

) ;

insert into annotation_type(annotation_type_id, annotation_type_name, annotation_type_desc)
values 
(1, 'BBox', '바운딩 박스 주석도구'),
(2, 'Polygon', '폴리곤 주석도구'),
(3, 'Segmentation', '폴리곤 주석도구'),
(4, 'Polyline', '세그먼트 주석도구'),
(5, 'Point', '폴리라인 주석도구 '),
(6, 'BrushPen', '브러쉬펜 주석도구'),
(7, 'Cube', '3D큐브 주석도구'),
(8, 'MagicWand', '매직완드(magic wand) 주석도구'),
(9, 'AutoPotint', '오토 포인트 주석도구'),
(10, 'KeyPoint', '키포인트 주석도구')
;


# md5
-- ALTER TABLE rawdata ADD COLUMN rawdata_md5 varchar(32);

# 
update system_info set updated=DATE('2023-02-14') where `version`='v0.5';

# modify fk 
-- ALTER TABLE task_detail DROP CONSTRAINT `task_detail_project_id_FK`;
-- ALTER TABLE task_detail DROP CONSTRAINT `task_detail_task_id_FK`;
-- ALTER TABLE task_detail ADD CONSTRAINT `task_detail_task_FK` FOREIGN KEY (`project_id`, `task_id`) REFERENCES `task` (`project_id`, `task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE ref_task_comment DROP CONSTRAINT `ref_task_comment_project_id_FK`;
-- ALTER TABLE ref_task_comment DROP CONSTRAINT `ref_task_comment_task_id_FK`;
-- ALTER TABLE ref_task_comment ADD CONSTRAINT `ref_task_comment_task_FK` FOREIGN KEY (`project_id`, `task_id`) REFERENCES `task` (`project_id`, `task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE annotation DROP CONSTRAINT `annotation_project_id_FK`;
-- ALTER TABLE annotation DROP CONSTRAINT `annotation_task_id_FK`;
-- ALTER TABLE annotation ADD CONSTRAINT `annotation_task_FK` FOREIGN KEY (`project_id`, `task_id`) REFERENCES `task` (`project_id`, `task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE annotation DROP CONSTRAINT `annotation_annotation_category_id_FK`;
-- ALTER TABLE annotation DROP CONSTRAINT `annotation_annotation_category_attr_id_FK`;
-- ALTER TABLE annotation ADD CONSTRAINT `annotation_annotation_annotation_category_attr_FK` FOREIGN KEY (`project_id`, `annotation_category_id`, `annotation_category_attr_id`) REFERENCES `annotation_category_attribute` (`project_id`, `annotation_category_id`,  `annotation_category_attr_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE annotation ADD score float;

-- ALTER TABLE annotation_category_attribute DROP CONSTRAINT `annotation_category_attribute_annotation_category_id_FK`;
-- ALTER TABLE annotation_category_attribute DROP CONSTRAINT `annotation_category_attribute_project_id_FK`;
-- ALTER TABLE annotation_category_attribute ADD CONSTRAINT `annotation_category_attribute_annotation_category_FK` FOREIGN KEY (`project_id`, `annotation_category_id`) REFERENCES `annotation_category` (`project_id`, `annotation_category_id`) ON DELETE CASCADE ON UPDATE CASCADE;


# DELETE SET NULL

-- ALTER TABLE task MODIFY task_type_id INT NULL;
-- ALTER TABLE task ADD CONSTRAINT `task_task_type_id_FK` FOREIGN KEY (`task_type_id`) REFERENCES `task_type` (`task_type_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE project MODIFY annotation_type_id int NULL;
-- ALTER TABLE project ADD CONSTRAINT `project_project_manager_id_FK` FOREIGN KEY (`project_manager_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE ;

-- ALTER TABLE annotation MODIFY annotation_type_id int NULL;
-- ALTER TABLE annotation ADD CONSTRAINT `annotation_annotation_type_id_FK` FOREIGN KEY (`annotation_type_id`) REFERENCES `annotation_type` (`annotation_type_id`) ON DELETE SET NULL ON UPDATE CASCADE ;

-- ALTER TABLE annotation MODIFY annotation_category_attr_val_input text;

# remove coco category (except person)
update system_info set updated=DATE('2023-02-14') where `version`='v0.5';


-- DELETE FROM annotation_category  
-- WHERE annotation_category_id in ( 
-- 	SELECT coco.annotation_category_id FROM annotation_category_coco coco where annotation_category_id not in ( 0 ) 
-- );
-- DELETE FROM annotation_category_coco coco where annotation_category_id not in ( 0 );


#
DROP TABLE if  exists `annotation_category_coco`;
DROP TABLE if  exists `annotation_category_predefined`;
CREATE TABLE `annotation_category_predefined` (
  `annotation_category_id` int NOT NULL ,
  `annotation_category_name` varchar(128) NOT NULL,
  `annotation_category_parent_id` int NULL,
  `annotation_category_color` varchar(10) NOT NULL DEFAULT '#4C6793',
  
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`annotation_category_id`)
) ;
insert into annotation_category_predefined(annotation_category_id, annotation_category_name) select      0,'person';


DROP TABLE if  exists `annotation_category_attribute_predefined`;
CREATE TABLE `annotation_category_attribute_predefined` (
  `annotation_category_attr_id` int NOT NULL,
  `annotation_category_id` int NOT NULL,
  `annotation_category_attr_name` varchar(64) NOT NULL,
  `annotation_category_attr_desc` varchar(256) NULL,
  `annotation_category_attr_type` int NOT NULL,
  `annotation_category_attr_val` varchar(256) NOT NULL,
  `annotation_category_attr_limit_min` int NULL,
  `annotation_category_attr_limit_max` int NULL,
 
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`annotation_category_attr_id`, `annotation_category_id`),
  CONSTRAINT `annotation_category_attribute_predefined_annotation_category_FK` FOREIGN KEY (`annotation_category_id`) REFERENCES `annotation_category_predefined` (`annotation_category_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

# 공지사항, 문의사항, 제휴문의
DROP TABLE if  exists `notice`;
CREATE TABLE `notice` (
  `notice_id` int NOT NULL, 
  `notice_type` varchar(32) NOT NULL, # 서비스, 작업, faq
  `is_faq_type` varchar(32) NULL, # faq인 경우 faq 종류 (member, service, price, solution, error , etc)
  `notice_title` varchar(32) NOT NULL,
  `notice_contents` varchar(1000) NOT NULL, 
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notice_id`)
);

DROP TABLE if  exists `inquiry`;
CREATE TABLE `inquiry` (
  `inquiry_id` int NOT NULL,
  `user_id` varchar(32) NULL,
  `inquiry_type` varchar(32) NOT NULL, # 사이트, 계정, 솔루션, 기타
  `inquiry_title` varchar(32) NOT NULL,
  `inquiry_user_display_name` varchar(32) NOT NULL,
  `inquiry_user_number` varchar(32) NOT NULL,
  `inquiry_user_email` varchar(321) NOT NULL,
  `inquiry_contents` varchar(1000) NOT NULL,
  `inquiry_status` varchar(32) NULL, # 답변 상태 (true,false)
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`inquiry_id`)
);

DROP TABLE if  exists `partnership_inquiry`;
CREATE TABLE `partnership_inquiry` (
  `partnership_inquiry_id` INT NOT NULL,
  `user_id` varchar(32) NULL,
  `partnership_inquiry_creator_name` varchar(32) NOT NULL, # 제안자(담당자)명
  `partnership_inquiry_type` varchar(32) NOT NULL, # 기술,판매,광고,사업,기타
  `partnership_inquiry_title` varchar(32) NOT NULL,
  `partnership_inquiry_contents` varchar(1000) NOT NULL,
  `partnership_inquiry_proposal` varchar(50) NULL,
  `partnership_inquiry_company_classification` varchar(32) NOT NULL, # 공공,대기업,중견,중소,스타트업,소상공인
  `partnership_inquiry_company_name` varchar(32) NOT NULL,
  `partnership_inquiry_company_number` varchar(32) NOT NULL,
  `partnership_inquiry_company_email` varchar(321) NOT NULL,
  `partnership_inquiry_company_website_url` varchar(32) NULL,
  `partnership_inquiry_company_introduction` varchar(50) NULL,
  `partnership_inquiry_status` varchar(32) NULL, # 답변 상태 (true,false) 
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`partnership_inquiry_id`)
);

# 조직 테이블
DROP TABLE if  exists `organization`;
CREATE TABLE `organization` (
  `organization_id` INT NOT NULL,#PK
  `organization_name` varchar(32) NULL, #로그인 페이지 조직이름 입력 추가 시 NOT NULL로 변경 
  `admin_id` varchar(32) NOT NULL, #FK
  `organization_email` varchar(321) NOT NULL,
  `token` varchar(50) NULL, 
  `organization_email_verification` varchar(32) NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`organization_id`),
  CONSTRAINT `organization_annotation_admin_id_FK` FOREIGN KEY (`admin_id`) REFERENCES `roles_globals` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

# 모델 관리
DROP TABLE if  exists `aimodel`;
CREATE TABLE if not exists `aimodel` (
  `project_id` int NOT NULL,
  `model_name` varchar(100) NOT NULL DEFAULT 'R_50_FPN_3x',
  `model_aug` INT NOT NULL DEFAULT 20,
  `model_epoch` INT NOT NULL DEFAULT 1000,
  `model_lr` FLOAT NOT NULL DEFAULT 0.00025,
  `model_conf` FLOAT NOT NULL DEFAULT 0.5,
  `model_batch` INT NOT NULL DEFAULT 2,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  CONSTRAINT `aimodel_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE
);