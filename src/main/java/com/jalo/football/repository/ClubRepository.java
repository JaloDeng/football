package com.jalo.football.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.jalo.football.entity.ClubEntity;

public interface ClubRepository
		extends JpaRepository<ClubEntity, Long>, JpaSpecificationExecutor<ClubEntity> {

}
