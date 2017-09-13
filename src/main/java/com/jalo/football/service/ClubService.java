package com.jalo.football.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalo.football.entity.ClubEntity;
import com.jalo.football.model.Club;
import com.jalo.football.repository.ClubRepository;

@Service
public class ClubService {

	@Autowired
	private ClubRepository clubRepository;
	
	@Transactional(readOnly = true)
	public Map<String, Object> findAll(Integer page, Integer size, List<Order> orders) {
		
		Map<String, Object> returnMap = new HashMap<>();
		List<Club> modelList = new ArrayList<>();
		
//		Sort sort = new Sort(Direction.DESC, "id");
		
//		new Order(Direction.DESC, "id");
		Sort sort = new Sort(orders);
		
		clubRepository.findAll(new PageRequest(page - 1, size, sort)).forEach(entityList -> {
			Club model = new Club();
			
			model.setId(entityList.getId());
			model.setName(entityList.getName());
			model.setBelong(entityList.getBelong());
			
			modelList.add(model);
		});
		
//		clubRepository.findAll(new PageRequest(page - 1, size)).forEach(entityList -> {
//			Club model = new Club();
//			
//			model.setId(entityList.getId());
//			model.setName(entityList.getName());
//			model.setBelong(entityList.getBelong());
//			
//			modelList.add(model);
//		});
		
		returnMap.put("items", modelList);
		returnMap.put("total", clubRepository.count());
		
		return returnMap;
	}
	
	@Transactional(readOnly = true)
	public Club findById(Long id) {
		
		ClubEntity entity = clubRepository.findOne(id);
		
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
		
		clubRepository.saveAndFlush(entity);
		
		return entity;
	}
	
}
