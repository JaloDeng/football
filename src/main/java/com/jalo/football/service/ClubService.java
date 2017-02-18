package com.jalo.football.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalo.football.entity.ClubEntity;
import com.jalo.football.model.Club;
import com.jalo.football.repository.ClubRepository;

@Service
public class ClubService {

	@Autowired
	private ClubRepository footballClubRepository;
	
	@Transactional(readOnly = true)
	public Club findById(Long id) {
		
		ClubEntity entity = footballClubRepository.findOne(id);
		
		if (entity == null) {
			return null;
		}
		
		Club model = new Club();
		
		model.setId(entity.getId());
		
		model.setName(entity.getName());
		
		model.setBelong(entity.getBelong());
		
		return model;
	}
	
	@Transactional
	public ClubEntity convert(Club model) {
		
		if (model == null) {
			return null;
		}
		
		ClubEntity entity = new ClubEntity();
		
		entity.setName(model.getName());
		entity.setBelong(model.getBelong());
		
		footballClubRepository.saveAndFlush(entity);
		
		return entity;
	}
	
}
