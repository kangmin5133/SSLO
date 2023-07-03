
# version v0.3 to v0.4
insert into system_info(`version`, `name`, `desc`, `created`, `updated` ) select 'v0.4', 'sslo_db', 'modify annotation_type', DATE('2022-11-04'), DATE('2022-11-05') ; 


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
ALTER TABLE rawdata ADD COLUMN rawdata_md5 varchar(32);

# 
update system_info set updated=DATE('2022-11-11') where `version`='v0.4';

# modify fk 
ALTER TABLE task_detail DROP CONSTRAINT `task_detail_project_id_FK`;
ALTER TABLE task_detail DROP CONSTRAINT `task_detail_task_id_FK`;
ALTER TABLE task_detail ADD CONSTRAINT `task_detail_task_FK` FOREIGN KEY (`project_id`, `task_id`) REFERENCES `task` (`project_id`, `task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE ref_task_comment DROP CONSTRAINT `ref_task_comment_project_id_FK`;
ALTER TABLE ref_task_comment DROP CONSTRAINT `ref_task_comment_task_id_FK`;
ALTER TABLE ref_task_comment ADD CONSTRAINT `ref_task_comment_task_FK` FOREIGN KEY (`project_id`, `task_id`) REFERENCES `task` (`project_id`, `task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE annotation DROP CONSTRAINT `annotation_project_id_FK`;
ALTER TABLE annotation DROP CONSTRAINT `annotation_task_id_FK`;
ALTER TABLE annotation ADD CONSTRAINT `annotation_task_FK` FOREIGN KEY (`project_id`, `task_id`) REFERENCES `task` (`project_id`, `task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE annotation DROP CONSTRAINT `annotation_annotation_category_id_FK`;
ALTER TABLE annotation DROP CONSTRAINT `annotation_annotation_category_attr_id_FK`;
ALTER TABLE annotation ADD CONSTRAINT `annotation_annotation_annotation_category_attr_FK` FOREIGN KEY (`project_id`, `annotation_category_id`, `annotation_category_attr_id`) REFERENCES `annotation_category_attribute` (`project_id`, `annotation_category_id`,  `annotation_category_attr_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE annotation ADD score float;

ALTER TABLE annotation_category_attribute DROP CONSTRAINT `annotation_category_attribute_annotation_category_id_FK`;
ALTER TABLE annotation_category_attribute DROP CONSTRAINT `annotation_category_attribute_project_id_FK`;
ALTER TABLE annotation_category_attribute ADD CONSTRAINT `annotation_category_attribute_annotation_category_FK` FOREIGN KEY (`project_id`, `annotation_category_id`) REFERENCES `annotation_category` (`project_id`, `annotation_category_id`) ON DELETE CASCADE ON UPDATE CASCADE;


# DELETE SET NULL

ALTER TABLE task MODIFY COLUMN `task_type_id` int NULL;
ALTER TABLE task MODIFY CONSTRAINT `task_task_type_id_FK` FOREIGN KEY (`task_type_id`) REFERENCES `task_type` (`task_type_id`) ON DELETE SET NULL ON UPDATE CASCADE ;

ALTER TABLE project MODIFY CONSTRAINT `project_project_manager_id_FK` FOREIGN KEY (`project_manager_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE ;

ALTER TABLE annotation MODIFY COLUMN `annotation_type_id` int NULL;
ALTER TABLE annotation MODIFY CONSTRAINT `annotation_annotation_type_id_FK` FOREIGN KEY (`annotation_type_id`) REFERENCES `annotation_type` (`annotation_type_id`) ON DELETE SET NULL ON UPDATE CASCADE ;

ALTER TABLE annotation MODIFY annotation_category_attr_val_input text;

# remove coco category (except person)
update system_info set updated=DATE('2022-11-24') where `version`='v0.4';


DELETE FROM annotation_category  
WHERE annotation_category_id in ( 
	SELECT coco.annotation_category_id FROM annotation_category_coco coco where annotation_category_id not in ( 0 ) 
);
DELETE FROM annotation_category_coco coco where annotation_category_id not in ( 0 );


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
) ;