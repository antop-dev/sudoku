package kr.nerv.antop.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import kr.nerv.antop.model.GridModel;
import kr.nerv.antop.service.GridService;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class GridServlet {
	// log4j
	protected Logger logger = Logger.getLogger(getClass());

	@Autowired
	private GridService service;

	@RequestMapping(value = "/grid/list.do", method = RequestMethod.POST)
	public ModelAndView list(@RequestParam int start, @RequestParam(required = false, defaultValue = "30") int limit,
			@RequestParam(required = false) String sort, @RequestParam(required = false) String dir) {
		ModelAndView mav = new ModelAndView("grid/list");
		// success
		boolean success = true;

		try {
			// 목록 조회
			List<GridModel> grids = service.list(start, limit, sort, dir);
			mav.addObject("grids", grids);
			// 목록 총 갯수 조회
			int total = service.count();
			mav.addObject("total", total);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);

			success = false;
			mav.addObject("msg", e.getMessage());
		}

		mav.addObject("success", success);

		return mav;
	}

	@RequestMapping(value = "/grid/get.do", method = RequestMethod.POST)
	public ModelAndView get(@RequestParam(required = false) int seq) {
		ModelAndView mav = new ModelAndView("grid/get");
		// success
		boolean success = true;

		try {
			GridModel sudoku = service.get(seq);
			mav.addObject("sudoku", sudoku);
		} catch (Exception e) {
			// log
			logger.error(e.getMessage(), e);

			success = false;
			// error message
			mav.addObject("msg", e.getMessage());
		}

		mav.addObject("success", success);

		return mav;
	}

	@RequestMapping(value = "/grid/correct.do", method = RequestMethod.POST)
	public ModelAndView correct(@RequestParam int seq, @RequestParam String answer, HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("grid/correct");
		// success
		boolean success = true;

		try {
			boolean bool = service.compare(seq, answer);
			
			// bool = true;
			
			mav.addObject("bool", bool);
		} catch (Exception e) {
			// log
			logger.error(e.getMessage(), e);

			success = false;
			// error message
			mav.addObject("msg", e.getMessage());
		}

		mav.addObject("success", success);

		return mav;
	}

	@RequestMapping(value = "/grid/regist.do")
	public ModelAndView regist(@RequestParam String grid) {
		ModelAndView mav = new ModelAndView("grid/regist");
		// success
		boolean success = true;

		try {
			GridModel sudoku = service.regist(grid);
			mav.addObject("sudoku", sudoku);
		} catch (Exception e) {
			// log
			logger.error(e.getMessage(), e);

			success = false;
			// error message
			mav.addObject("msg", e.getMessage());
		}

		mav.addObject("success", success);

		return mav;
	}

	@RequestMapping(value = "/grid/solve.do")
	public ModelAndView solve(@RequestParam int seq, @RequestParam(required = false) String grid) {
		ModelAndView mav = new ModelAndView("grid/solve");
		// success
		boolean success = true;

		try {
			List<String> solutions = service.solve(seq, grid);
			mav.addObject("solutions", solutions);
		} catch (Exception e) {
			// log
			logger.error(e.getMessage(), e);

			success = false;
			// error message
			mav.addObject("msg", e.getMessage());
		}

		mav.addObject("success", success);

		return mav;
	}

}