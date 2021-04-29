package kr.nerv.antop.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import kr.nerv.antop.dao.ScoreDao;
import kr.nerv.antop.model.ScoreModel;

@Repository
public class ScoreDaoImpl extends NamedParameterJdbcDaoSupport implements ScoreDao {

	@Autowired
	public ScoreDaoImpl(DataSource ds) {
		setDataSource(ds);
	}

	// row mapper instance
	private RowMapper<ScoreModel> rowMapper = new ScoreRowMapper();

	public ScoreModel findById(int seq) throws Exception {
		// query
		String sql = "select * from " + ScoreDao.TABLE_NAME + " where " + Columns.SEQ + " = :seq";
		// parameter
		SqlParameterSource params = new MapSqlParameterSource("seq", seq);

		try {
			return getNamedParameterJdbcTemplate().queryForObject(sql, params, rowMapper);
		} catch (EmptyResultDataAccessException e) {
			return null;
		}
	}

	public List<ScoreModel> findByGrid(int seq) throws Exception {
		// query
		String sql = "select * from " + ScoreDao.TABLE_NAME + " where " + Columns.GRID_SEQ + " = :seq";
		// order
		sql += " order by " + Columns.COST + " asc, created desc";
		// parameter
		SqlParameterSource params = new MapSqlParameterSource("seq", seq);
		// execute query
		return getNamedParameterJdbcTemplate().query(sql, params, rowMapper);
	}

	public int create(ScoreModel score) throws Exception {
		// query
		String sql = "insert into " + ScoreDao.TABLE_NAME + " (" + Columns.GRID_SEQ + ", "
				+ Columns.NAME + ", " + Columns.COST + ") values (:grid, :name, :cost)";
		// parameter
		SqlParameterSource params = new BeanPropertySqlParameterSource(score);
		// key holder
		KeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		// execute query
		getNamedParameterJdbcTemplate().update(sql, params, generatedKeyHolder);
		// return auto increment
		return generatedKeyHolder.getKey().intValue();
	}

	@Override
	public void update(ScoreModel score) throws Exception {
		//query
		String sql = "update " + ScoreDao.TABLE_NAME + " set ";
		sql += Columns.NAME + " = :name, ";
		sql += Columns.COST + " = :cost, ";
		sql += Columns.MODIFIED + " = :modified";
		sql += " where " + Columns.SEQ + " = :seq";
		// parameter
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("name", score.getName());
		map.put("cost", score.getCost());
		map.put("modified", new Date());
		map.put("seq", score.getSeq());
		// execute query
		getNamedParameterJdbcTemplate().update(sql, map);
	}
	
	@Override
	public void delete(ScoreModel score) throws Exception {
		// query
		String sql = "delete from " + ScoreDao.TABLE_NAME + " where " + Columns.SEQ + " = :seq";
		// parameter
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("seq", score.getSeq());
		// execute query
		getNamedParameterJdbcTemplate().update(sql, map);
	}
	
	@Override
	public int getRank(ScoreModel score) throws Exception {
		// query
		String sql = "select count(*) from " + ScoreDao.TABLE_NAME + " where " + Columns.GRID_SEQ + " = :gridSeq and seq <= :seq";
		// parameter
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("gridSeq", score.getGrid());
		map.put("seq", score.getSeq());

		// execute query
		return getNamedParameterJdbcTemplate().queryForInt(sql, map);
	}
	
	// row mapper
	static class ScoreRowMapper implements RowMapper<ScoreModel> {

		public ScoreModel mapRow(ResultSet rs, int arg1) throws SQLException {
			ScoreModel score = new ScoreModel();
			score.setSeq(rs.getInt("seq"));
			score.setGrid(rs.getInt("grid_seq"));
			score.setName(rs.getString("name"));
			score.setCost(rs.getTime("cost"));
			score.setCreated(rs.getTimestamp("created"));
			score.setModified(rs.getTimestamp("modified"));

			return score;
		}

	}
}
